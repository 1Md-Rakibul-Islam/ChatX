"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { MessageCircle, Users, Search } from "lucide-react";
import { Sidebar } from "@/components/sections/chat/Sidebar";
import { ChatHeader } from "@/components/sections/chat/ChatHeader";
import { MessageList } from "@/components/sections/chat/MessageList";
import { MessageInput } from "@/components/sections/chat/MessageInput";
import { NewChatDialog } from "@/components/sections/chat/NewChatDialog";
import { CreateGroupDialog } from "@/components/sections/chat/CreateGroupDialog";
import { GroupInfoDialog } from "@/components/sections/chat/GroupInfoDialog";
import type { IMessage, IUser, TConversation } from "@/types/chat.interface";
import { cn } from "@/lib/utils";
import {
  getConversations,
  getMessages,
  sendMessage as apiSendMessage,
  searchUsers,
  startDirectConversation,
  createGroup,
  addGroupMembers,
  removeGroupMember,
  promoteAdmin,
  renameGroup,
} from "@/lib/api-client";
import { connectSocket, disconnectSocket } from "@/lib/websocket";
import type { Socket } from "socket.io-client";

interface ChatAppProps {
  currentUser: IUser;
  token: string;
  onLogout: () => void;
}

export function ChatApp({ currentUser, token, onLogout }: ChatAppProps) {
  const [conversations, setConversations] = useState<TConversation[]>([]);
  const [messagesByConv, setMessagesByConv] = useState<
    Record<string, IMessage[]>
  >({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [unread, setUnread] = useState<Record<string, number>>({});
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageError, setMessageError] = useState<string | null>(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const [searchableUsers, setSearchableUsers] = useState<IUser[]>([]);

  const socketRef = useRef<Socket | null>(null);
  const activeIdRef = useRef<string | null>(null);

  activeIdRef.current = activeId;

  const activeConv = useMemo(
    () => conversations.find((c) => c._id === activeId) ?? null,
    [conversations, activeId],
  );

  const activeMessages = activeId ? (messagesByConv[activeId] ?? []) : [];

  const senderNames = useMemo(() => {
    const map: Record<string, string> = {};
    map[currentUser._id] = currentUser.name;
    conversations.forEach((c) => {
      if (c.type === "direct" && c.participant) {
        map[c.participant._id] = c.participant.name;
      } else if (c.type === "group") {
        c.participants.forEach((p) => {
          map[p._id] = p.name;
        });
      }
    });
    return map;
  }, [conversations, currentUser]);

  // Load conversations on mount
  const loadConversations = useCallback(async () => {
    try {
      const data = await getConversations();
      const sorted = [...data].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
      setConversations(sorted);
    } catch (err) {
      setMessageError(
        err instanceof Error ? err.message : "Failed to load conversations",
      );
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Connect socket
  useEffect(() => {
    const socket = connectSocket(token);
    socketRef.current = socket;

    socket.on("message:new", (msg: IMessage) => {
      const convId = msg.conversation;
      setMessagesByConv((prev) => ({
        ...prev,
        [convId]: [...(prev[convId] ?? []), msg],
      }));

      // Update last message + sort
      setConversations((prev) =>
        prev
          .map((c) =>
            c._id === convId
              ? {
                  ...c,
                  updatedAt: msg.createdAt,
                  lastMessage: {
                    text: msg.text,
                    sender: msg.sender,
                    createdAt: msg.createdAt,
                  },
                }
              : c,
          )
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
          ),
      );

      // Increment unread if not the active conversation
      if (activeIdRef.current !== convId) {
        setUnread((prev) => ({ ...prev, [convId]: (prev[convId] ?? 0) + 1 }));
      }
    });

    socket.on("conversation:updated", (updatedConv: TConversation) => {
      setConversations((prev) => {
        const exists = prev.some((c) => c._id === updatedConv._id);
        if (exists) {
          return prev
            .map((c) => (c._id === updatedConv._id ? updatedConv : c))
            .sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime(),
            );
        }
        return [updatedConv, ...prev].sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        );
      });
    });

    return () => {
      disconnectSocket();
    };
  }, [token]);

  // Load messages when selecting a conversation
  const loadMessages = useCallback(async (convId: string) => {
    setLoadingMessages(true);
    setMessageError(null);
    try {
      const res = await getMessages(convId, { limit: 50 });
      setMessagesByConv((prev) => ({ ...prev, [convId]: res.messages }));
    } catch (err) {
      setMessageError(
        err instanceof Error ? err.message : "Failed to load messages",
      );
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  function handleSelect(id: string) {
    if (id === activeId) return;
    setActiveId(id);
    setMobileView("chat");
    setUnread((prev) => ({ ...prev, [id]: 0 }));
    if (!messagesByConv[id]) {
      loadMessages(id);
    }
  }

  async function handleSend(text: string) {
    if (!activeId) return;
    const convId = activeId;

    // Optimistic message
    const tempId = `temp-${Date.now()}`;
    const optimistic: IMessage = {
      _id: tempId,
      conversation: convId,
      sender: currentUser._id,
      text,
      createdAt: new Date().toISOString(),
      status: "sending",
    };
    setMessagesByConv((prev) => ({
      ...prev,
      [convId]: [...(prev[convId] ?? []), optimistic],
    }));

    // Update conversation list preview
    setConversations((prev) =>
      prev
        .map((c) =>
          c._id === convId
            ? {
                ...c,
                updatedAt: new Date().toISOString(),
                lastMessage: {
                  text,
                  sender: currentUser._id,
                  createdAt: new Date().toISOString(),
                },
              }
            : c,
        )
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        ),
    );

    try {
      const sent = await apiSendMessage(convId, text);
      // Replace optimistic message with real one
      setMessagesByConv((prev) => ({
        ...prev,
        [convId]: (prev[convId] ?? []).map((m) =>
          m._id === tempId ? { ...sent, status: "sent" as const } : m,
        ),
      }));
    } catch (err) {
      // Mark as failed
      setMessagesByConv((prev) => ({
        ...prev,
        [convId]: (prev[convId] ?? []).map((m) =>
          m._id === tempId ? { ...m, status: "sent" as const } : m,
        ),
      }));
      setMessageError(
        err instanceof Error ? err.message : "Failed to send message",
      );
    }
  }

  // Load searchable users when dialog opens
  async function handleOpenNewChat() {
    setShowNewChat(true);
    if (searchableUsers.length === 0) {
      try {
        // Broad search to get all users
        const users = await searchUsers("");
        setSearchableUsers(users.filter((u) => u._id !== currentUser._id));
      } catch {
        // ignore — user can type to search
      }
    }
  }

  async function handleSearchUsers(query: string): Promise<IUser[]> {
    try {
      const users = await searchUsers(query);
      return users.filter((u) => u._id !== currentUser._id);
    } catch {
      return [];
    }
  }

  async function handleStartConversation(userId: string) {
    const existing = conversations.find(
      (c) => c.type === "direct" && c.participant?._id === userId,
    );
    if (existing) {
      handleSelect(existing._id);
      setShowNewChat(false);
      return;
    }

    try {
      const res = await startDirectConversation(userId);
      // Reload conversations to get the full conversation object
      await loadConversations();
      handleSelect(res._id);
      setShowNewChat(false);
    } catch (err) {
      setMessageError(
        err instanceof Error ? err.message : "Failed to start conversation",
      );
    }
  }

  async function handleCreateGroup(name: string, participantIds: string[]) {
    try {
      const group = await createGroup(name, participantIds);
      setConversations((prev) =>
        [group, ...prev].sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        ),
      );
      setActiveId(group._id);
      setMobileView("chat");
      setMessagesByConv((prev) => ({ ...prev, [group._id]: [] }));
      setShowCreateGroup(false);
    } catch (err) {
      setMessageError(
        err instanceof Error ? err.message : "Failed to create group",
      );
    }
  }

  async function handleRenameGroup(name: string) {
    if (!activeConv || activeConv.type !== "group") return;
    try {
      const updated = await renameGroup(activeConv._id, name);
      setConversations((prev) =>
        prev.map((c) => (c._id === updated._id ? updated : c)),
      );
    } catch (err) {
      setMessageError(
        err instanceof Error ? err.message : "Failed to rename group",
      );
    }
  }

  async function handleAddMember(userId: string) {
    if (!activeConv || activeConv.type !== "group") return;
    try {
      const updated = await addGroupMembers(activeConv._id, [userId]);
      setConversations((prev) =>
        prev.map((c) => (c._id === updated._id ? updated : c)),
      );
    } catch (err) {
      setMessageError(
        err instanceof Error ? err.message : "Failed to add member",
      );
    }
  }

  async function handleRemoveMember(userId: string) {
    if (!activeConv || activeConv.type !== "group") return;
    try {
      const updated = await removeGroupMember(activeConv._id, userId);
      setConversations((prev) =>
        prev.map((c) => (c._id === updated._id ? updated : c)),
      );
    } catch (err) {
      setMessageError(
        err instanceof Error ? err.message : "Failed to remove member",
      );
    }
  }

  async function handlePromoteAdmin(userId: string) {
    if (!activeConv || activeConv.type !== "group") return;
    try {
      const updated = await promoteAdmin(activeConv._id, userId);
      setConversations((prev) =>
        prev.map((c) => (c._id === updated._id ? updated : c)),
      );
    } catch (err) {
      setMessageError(
        err instanceof Error ? err.message : "Failed to promote admin",
      );
    }
  }

  function handleLeaveGroup() {
    if (!activeConv || activeConv.type !== "group") return;
    handleRemoveMember(currentUser._id);
    setConversations((prev) => prev.filter((c) => c._id !== activeConv._id));
    setActiveId(null);
    setShowGroupInfo(false);
    setMobileView("list");
  }

  function handleBack() {
    setMobileView("list");
  }

  function handleRetry() {
    setMessageError(null);
    if (activeId) loadMessages(activeId);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div
        className={cn(
          "w-full shrink-0 border-r border-border md:w-80 lg:w-96",
          mobileView === "chat" ? "hidden md:block" : "block",
        )}
      >
        <Sidebar
          conversations={conversations}
          activeId={activeId}
          onSelect={handleSelect}
          onNewChat={handleOpenNewChat}
          onCreateGroup={() => setShowCreateGroup(true)}
          onLogout={onLogout}
          unreadCount={(id) => unread[id] ?? 0}
          currentUser={currentUser}
        />
      </div>

      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col",
          mobileView === "list" ? "hidden md:flex" : "flex",
        )}
      >
        {activeConv ? (
          <>
            <ChatHeader
              conversation={activeConv}
              onBack={handleBack}
              onInfo={() =>
                activeConv.type === "group" && setShowGroupInfo(true)
              }
            />
            <MessageList
              messages={activeMessages}
              senderNames={senderNames}
              loading={loadingMessages}
              error={messageError}
              onRetry={handleRetry}
              currentUserId={currentUser._id}
            />
            <MessageInput onSend={handleSend} disabled={loadingMessages} />
          </>
        ) : (
          <EmptyChatPanel />
        )}
      </div>

      <NewChatDialog
        open={showNewChat}
        onClose={() => setShowNewChat(false)}
        users={searchableUsers}
        onStart={handleStartConversation}
        onSearch={handleSearchUsers}
      />
      <CreateGroupDialog
        open={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
        users={searchableUsers}
        onCreate={handleCreateGroup}
        onSearch={handleSearchUsers}
      />
      <GroupInfoDialog
        open={showGroupInfo}
        conversation={activeConv?.type === "group" ? activeConv : null}
        onClose={() => setShowGroupInfo(false)}
        onRename={handleRenameGroup}
        onAddMember={handleAddMember}
        onRemoveMember={handleRemoveMember}
        onPromoteAdmin={handlePromoteAdmin}
        onLeave={handleLeaveGroup}
        searchableUsers={searchableUsers}
        currentUserId={currentUser._id}
      />
    </div>
  );
}

function EmptyChatPanel() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-secondary/20 px-6 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-linear-to-br from-sky-500 to-cyan-600 shadow-xl shadow-sky-500/25">
        <MessageCircle className="h-12 w-12 text-white" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight">Welcome to Pulse</h2>
      <p className="mt-2 max-w-sm text-muted-foreground">
        Select a conversation from the sidebar, or start a new one to begin
        chatting.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm">
          <Users className="h-4 w-4 text-primary" />
          Create group chats
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm">
          <Search className="h-4 w-4 text-primary" />
          Search by name or phone
        </div>
      </div>
    </div>
  );
}

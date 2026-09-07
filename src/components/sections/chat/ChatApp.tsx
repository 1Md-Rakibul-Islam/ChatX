"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { MessageCircle, Users, ArrowLeft, Search } from "lucide-react";
import { Sidebar } from "@/components/chat/Sidebar";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageList } from "@/components/chat/MessageList";
import { MessageInput } from "@/components/chat/MessageInput";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { NewChatDialog } from "@/components/chat/NewChatDialog";
import { CreateGroupDialog } from "@/components/chat/CreateGroupDialog";
import { GroupInfoDialog } from "@/components/chat/GroupInfoDialog";
import type {
  Conversation,
  Message,
  User,
  GroupConversation,
} from "@/lib/chat-types";
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
import { connectSocket, disconnectSocket } from "@/lib/socket";
import type { Socket } from "socket.io-client";

interface ChatAppProps {
  currentUser: User;
  token: string;
  onLogout: () => void;
}

export function ChatApp({ currentUser, token, onLogout }: ChatAppProps) {
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
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-cyan-600 shadow-xl shadow-sky-500/25">
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

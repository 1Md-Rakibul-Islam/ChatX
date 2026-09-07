"use client";

import { useState, useMemo } from "react";
import {
  Search,
  MessageSquarePlus,
  Users,
  X,
  MessageCircle,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getInitials, formatChatListTime } from "@/lib/date-time.utils";
import type { TConversation, IUser } from "@/types/chat.interface";
import { avatarColor } from "@/lib/avatar.utils";

interface SidebarProps {
  conversations: TConversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onCreateGroup: () => void;
  onLogout: () => void;
  unreadCount?: (id: string) => number;
  currentUser: IUser;
}

export function Sidebar({
  conversations,
  activeId,
  onSelect,
  onNewChat,
  onCreateGroup,
  onLogout,
  unreadCount,
  currentUser,
}: SidebarProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((c) => {
      if (c.type === "group") {
        return c.name.toLowerCase().includes(q);
      }
      return c.participant?.name?.toLowerCase().includes(q);
    });
  }, [conversations, query]);

  return (
    <div className="flex h-full flex-col bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 shadow-md shadow-sky-500/20">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none tracking-tight">
              Pulse
            </h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Conversations
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onNewChat}
            title="New chat"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
          >
            <MessageSquarePlus className="h-5 w-5" />
          </button>
          <button
            onClick={onCreateGroup}
            title="Create group"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
          >
            <Users className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Current user strip */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white",
              avatarColor(currentUser._id),
            )}
          >
            {getInitials(currentUser.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{currentUser.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {currentUser.phone}
            </p>
          </div>
        </div>
        <button
          onClick={onLogout}
          title="Log out"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>

      {/* Search */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full rounded-lg border border-input bg-secondary/50 py-2.5 pl-9 pr-9 text-sm transition-all placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">No conversations found</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try a different search or start a new chat.
            </p>
          </div>
        ) : (
          <ul className="px-2">
            {filtered.map((c) => (
              <ConversationRow
                key={c._id}
                conversation={c}
                active={c._id === activeId}
                onClick={() => onSelect(c._id)}
                unread={unreadCount?.(c._id) ?? 0}
                currentUserId={currentUser._id}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function ConversationRow({
  conversation,
  active,
  onClick,
  unread,
  currentUserId,
}: {
  conversation: TConversation;
  active: boolean;
  onClick: () => void;
  unread: number;
  currentUserId: string;
}) {
  const isGroup = conversation.type === "group";
  const name = isGroup
    ? conversation.name
    : (conversation.participant?.name ?? "Unknown");
  const lastMsg = conversation.lastMessage;
  const lastText = lastMsg && "text" in lastMsg ? lastMsg.text : "";
  const lastTime =
    lastMsg && "createdAt" in lastMsg
      ? lastMsg.createdAt
      : conversation.updatedAt;
  const isOwnLast =
    lastMsg && "sender" in lastMsg && lastMsg.sender === currentUserId;

  let preview = lastText || "No messages yet";
  if (isGroup && isOwnLast && lastText) preview = `You: ${preview}`;
  else if (isGroup && lastMsg && "sender" in lastMsg && lastMsg.sender) {
    const sender = conversation.participants.find(
      (p) => p._id === lastMsg.sender,
    );
    if (sender) preview = `${sender.name.split(" ")[0]}: ${preview}`;
  }

  return (
    <li>
      <button
        onClick={onClick}
        className={cn(
          "group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors",
          active ? "bg-primary/10" : "hover:bg-secondary",
        )}
      >
        {/* Avatar */}
        {isGroup ? (
          <div
            className={cn(
              "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-400 to-slate-600 shadow-sm",
              active && "ring-2 ring-primary/30",
            )}
          >
            <Users className="h-5 w-5 text-white" />
          </div>
        ) : (
          <div
            className={cn(
              "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white shadow-sm",
              avatarColor(conversation.participant?._id ?? "x"),
              active && "ring-2 ring-primary/30",
            )}
          >
            {getInitials(name)}
            <span className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-card bg-emerald-500" />
          </div>
        )}

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <p
              className={cn(
                "truncate text-sm font-semibold",
                active && "text-primary",
              )}
            >
              {name}
            </p>
            <span className="shrink-0 text-xs text-muted-foreground">
              {formatChatListTime(lastTime)}
            </span>
          </div>
          <div className="mt-0.5 flex items-center justify-between gap-2">
            <p className="truncate text-sm text-muted-foreground">{preview}</p>
            {unread > 0 && (
              <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-primary-foreground">
                {unread}
              </span>
            )}
          </div>
        </div>
      </button>
    </li>
  );
}

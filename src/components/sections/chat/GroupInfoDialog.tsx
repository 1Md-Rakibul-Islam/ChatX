"use client";

import { useState } from "react";
import {
  X,
  Users,
  Crown,
  UserMinus,
  ShieldPlus,
  Edit2,
  Check,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/date-time.utils";
import type { IGroupConversation, IUser } from "@/types/chat.interface";
import { avatarColor } from "@/lib/avatar.utils";

interface GroupInfoDialogProps {
  open: boolean;
  conversation: IGroupConversation | null;
  onClose: () => void;
  onRename: (name: string) => void;
  onAddMember: (userId: string) => void;
  onRemoveMember: (userId: string) => void;
  onPromoteAdmin: (userId: string) => void;
  onLeave: () => void;
  searchableUsers: IUser[];
  currentUserId: string;
}

export function GroupInfoDialog({
  open,
  conversation,
  onClose,
  onRename,
  onAddMember,
  onRemoveMember,
  onPromoteAdmin,
  onLeave,
  searchableUsers,
  currentUserId,
}: GroupInfoDialogProps) {
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  if (!open || !conversation) return null;

  const isCurrentUserAdmin = conversation.admins.includes(currentUserId);
  const memberIds = new Set(conversation.participants.map((p) => p._id));
  const availableToAdd = searchableUsers.filter(
    (u) => !memberIds.has(u._id) && u._id !== currentUserId,
  );

  function startEdit() {
    setNameValue(conversation!.name);
    setEditingName(true);
  }

  function saveName() {
    if (nameValue.trim()) {
      onRename(nameValue.trim());
    }
    setEditingName(false);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-[6vh] backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl animate-slide-in-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative flex flex-col items-center border-b border-border px-5 py-6">
          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-sky-500 to-cyan-600 shadow-lg shadow-sky-500/25">
            <Users className="h-9 w-9 text-white" />
          </div>
          {editingName ? (
            <div className="mt-3 flex items-center gap-2">
              <input
                autoFocus
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveName()}
                className="rounded-lg border border-primary/40 px-3 py-1.5 text-center text-lg font-bold outline-none ring-2 ring-primary/20"
              />
              <button
                onClick={saveName}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
              >
                <Check className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="mt-3 flex items-center gap-2">
              <h2 className="text-lg font-bold">{conversation.name}</h2>
              {isCurrentUserAdmin && (
                <button
                  onClick={startEdit}
                  className="text-muted-foreground hover:text-primary"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
          <p className="mt-1 text-sm text-muted-foreground">
            {conversation.participants.length} members
          </p>
        </div>

        {/* Admin actions */}
        {isCurrentUserAdmin && (
          <div className="border-b border-border px-5 py-3">
            {showAdd ? (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-semibold">Add member</p>
                  <button
                    onClick={() => setShowAdd(false)}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                </div>
                {availableToAdd.length === 0 ? (
                  <p className="py-3 text-center text-sm text-muted-foreground">
                    No users available to add
                  </p>
                ) : (
                  <div className="max-h-40 overflow-y-auto scrollbar-thin">
                    <ul className="space-y-1">
                      {availableToAdd.map((u) => (
                        <li key={u._id}>
                          <button
                            onClick={() => {
                              onAddMember(u._id);
                              setShowAdd(false);
                            }}
                            className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-secondary"
                          >
                            <div
                              className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white",
                                avatarColor(u._id),
                              )}
                            >
                              {getInitials(u.name)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">
                                {u.name}
                              </p>
                              <p className="truncate text-xs text-muted-foreground">
                                {u.phone}
                              </p>
                            </div>
                            <span className="text-xs font-medium text-primary">
                              Add
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAdd(true)}
                className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-secondary"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Users className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold text-primary">
                  Add members
                </span>
              </button>
            )}
          </div>
        )}

        {/* Members list */}
        <div className="px-5 py-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Members
          </p>
          <div className="max-h-64 overflow-y-auto scrollbar-thin">
            <ul className="space-y-1">
              {conversation.participants.map((p) => {
                const isAdmin = conversation.admins.includes(p._id);
                const isMe = p._id === currentUserId;
                return (
                  <li
                    key={p._id}
                    className="group flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-secondary"
                  >
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white",
                        avatarColor(p._id),
                      )}
                    >
                      {getInitials(p.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-sm font-semibold">
                          {p.name}
                          {isMe && " (You)"}
                        </p>
                        {isAdmin && (
                          <span className="flex items-center gap-0.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">
                            <Crown className="h-2.5 w-2.5" />
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {p.phone}
                      </p>
                    </div>
                    {isCurrentUserAdmin && !isMe && (
                      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        {!isAdmin && (
                          <button
                            onClick={() => onPromoteAdmin(p._id)}
                            title="Promote to admin"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-amber-100 hover:text-amber-600 dark:hover:bg-amber-500/15"
                          >
                            <ShieldPlus className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onRemoveMember(p._id)}
                          title="Remove member"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        >
                          <UserMinus className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Leave group */}
        <div className="border-t border-border px-5 py-3">
          <button
            onClick={onLeave}
            className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-destructive/10"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <LogOut className="h-5 w-5" />
            </div>
            <span className="text-sm font-semibold text-destructive">
              Leave group
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

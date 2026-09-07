"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Search, X, MessageSquarePlus, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/date-time.utils";
import type { IUser } from "@/types/chat.interface";
import { avatarColor } from "@/lib/avatar.utils";

interface NewChatDialogProps {
  open: boolean;
  onClose: () => void;
  users: IUser[];
  onStart: (userId: string) => void;
  onSearch?: (query: string) => Promise<IUser[]>;
}

export function NewChatDialog({
  open,
  onClose,
  users,
  onStart,
  onSearch,
}: NewChatDialogProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<IUser | null>(null);
  const [searchResults, setSearchResults] = useState<IUser[] | null>(null);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filtered = useMemo(() => {
    if (searchResults !== null) return searchResults;
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.name.toLowerCase().includes(q) || u.phone.includes(q),
    );
  }, [users, query, searchResults]);

  useEffect(() => {
    if (!onSearch || !query.trim()) {
      setSearchResults(null);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await onSearch(query.trim());
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 350);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, onSearch]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setSelected(null);
      setSearchResults(null);
    }
  }, [open]);

  if (!open) return null;

  function handleClose() {
    setQuery("");
    setSelected(null);
    setSearchResults(null);
    onClose();
  }

  function handleStart() {
    if (selected) {
      onStart(selected._id);
      setQuery("");
      setSelected(null);
      setSearchResults(null);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-[10vh] backdrop-blur-sm animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl animate-slide-in-right"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MessageSquarePlus className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold">New conversation</h2>
          </div>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5">
          <div className="relative mb-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or phone..."
              className="w-full rounded-xl border border-input bg-secondary/50 py-2.5 pl-9 pr-9 text-sm transition-all placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {searching && (
              <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
            )}
          </div>

          <div className="max-h-64 overflow-y-auto scrollbar-thin">
            {filtered.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm text-muted-foreground">
                  {query.trim() ? "No users found" : "Start typing to search"}
                </p>
              </div>
            ) : (
              <ul className="space-y-1">
                {filtered.map((u) => (
                  <li key={u._id}>
                    <button
                      onClick={() => setSelected(u)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                        selected?._id === u._id
                          ? "bg-primary/10"
                          : "hover:bg-secondary",
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white",
                          avatarColor(u._id),
                        )}
                      >
                        {getInitials(u.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                          {u.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {u.phone}
                        </p>
                      </div>
                      {selected?._id === u._id && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            onClick={handleStart}
            disabled={!selected}
            className="mt-5 w-full rounded-xl bg-linear-to-r from-sky-500 to-cyan-600 py-3 font-semibold text-white shadow-md shadow-sky-500/25 transition-all hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
          >
            Start conversation
          </button>
        </div>
      </div>
    </div>
  );
}

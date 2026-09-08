"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Search, X, Users, Check, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/date-time.utils";
import type { IUser } from "@/types/chat.interface";
import { avatarColor } from "@/lib/avatar.utils";

interface CreateGroupDialogProps {
  open: boolean;
  onClose: () => void;
  users: IUser[];
  onCreate: (name: string, participantIds: string[]) => void;
  onSearch?: (query: string) => Promise<IUser[]>;
}

export function CreateGroupDialog({
  open,
  onClose,
  users,
  onCreate,
  onSearch,
}: CreateGroupDialogProps) {
  const [step, setStep] = useState<"select" | "name">("select");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<IUser[]>([]);
  const [groupName, setGroupName] = useState("");
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
      setStep("select");
      setQuery("");
      setSelected([]);
      setGroupName("");
      setSearchResults(null);
    }
  }, [open]);

  if (!open) return null;

  function handleClose() {
    setStep("select");
    setQuery("");
    setSelected([]);
    setGroupName("");
    setSearchResults(null);
    onClose();
  }

  function toggleUser(u: IUser) {
    setSelected((prev) =>
      prev.some((p) => p._id === u._id)
        ? prev.filter((p) => p._id !== u._id)
        : [...prev, u],
    );
  }

  function handleCreate() {
    if (groupName.trim() && selected.length >= 2) {
      onCreate(
        groupName.trim(),
        selected?.map((u) => u._id),
      );
      handleClose();
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
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold leading-tight">
                {step === "select" ? "Select members" : "Name the group"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {selected.length} selected
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {step === "select" ? (
          <div className="p-5">
            {selected.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {selected?.map((u) => (
                  <div
                    key={u._id}
                    className="flex items-center gap-1.5 rounded-full bg-primary/10 py-1 pl-1 pr-2.5"
                  >
                    <div
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white",
                        avatarColor(u._id),
                      )}
                    >
                      {getInitials(u.name)}
                    </div>
                    <span className="text-xs font-medium">
                      {u.name.split(" ")[0]}
                    </span>
                    <button
                      onClick={() => toggleUser(u)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

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

            <div className="max-h-56 overflow-y-auto scrollbar-thin">
              {filtered.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  {query.trim() ? "No users found" : "Start typing to search"}
                </p>
              ) : (
                <ul className="space-y-1">
                  {filtered?.map((u) => {
                    const isSelected = selected.some((p) => p._id === u._id);
                    return (
                      <li key={u._id}>
                        <button
                          onClick={() => toggleUser(u)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                            isSelected ? "bg-primary/10" : "hover:bg-secondary",
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
                          <div
                            className={cn(
                              "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors",
                              isSelected
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border",
                            )}
                          >
                            {isSelected && <Check className="h-4 w-4" />}
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <button
              onClick={() => setStep("name")}
              disabled={selected.length < 2}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-sky-500 to-cyan-600 py-3 font-semibold text-white shadow-md shadow-sky-500/25 transition-all hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
              Next
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="p-5">
            <div className="mb-4 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-sky-500 to-cyan-600 shadow-lg shadow-sky-500/25">
                <Users className="h-9 w-9 text-white" />
              </div>
            </div>

            <label className="mb-2 block text-sm font-medium">Group name</label>
            <input
              autoFocus
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="e.g. Project Team"
              className="w-full rounded-xl border border-input bg-secondary/50 px-4 py-3 text-sm transition-all placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />

            <div className="mt-4 rounded-xl bg-secondary/50 p-3">
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                {selected.length + 1} members (including you)
              </p>
              <div className="flex flex-wrap gap-1.5">
                {selected?.map((u) => (
                  <span
                    key={u._id}
                    className="rounded-full bg-card px-2.5 py-1 text-xs font-medium"
                  >
                    {u.name.split(" ")[0]}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setStep("select")}
                className="flex-1 rounded-xl border border-border py-3 font-semibold transition-colors hover:bg-secondary"
              >
                Back
              </button>
              <button
                onClick={handleCreate}
                disabled={!groupName.trim()}
                className="flex-2 rounded-xl bg-linear-to-r from-sky-500 to-cyan-600 py-3 font-semibold text-white shadow-md shadow-sky-500/25 transition-all hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
              >
                Create group
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

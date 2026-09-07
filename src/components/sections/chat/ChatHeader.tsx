"use client";

import {
  ArrowLeft,
  MoreVertical,
  Users,
  Phone,
  Video,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/date-time.utils";
import type { TConversation } from "@/types/chat.interface";
import { avatarColor } from "@/lib/avatar.utils";

interface ChatHeaderProps {
  conversation: TConversation;
  onBack: () => void;
  onInfo: () => void;
}

export function ChatHeader({ conversation, onBack, onInfo }: ChatHeaderProps) {
  const isGroup = conversation.type === "group";
  const name = isGroup
    ? conversation.name
    : (conversation.participant?.name ?? "Unknown");
  const subtitle = isGroup
    ? `${conversation.participants.length} members`
    : "Active now";

  return (
    <div className="flex items-center gap-3 border-b border-border bg-card px-3 py-2.5 sm:px-4">
      <button
        onClick={onBack}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      <button
        onClick={onInfo}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        {isGroup ? (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-400 to-slate-600 shadow-sm">
            <Users className="h-5 w-5 text-white" />
          </div>
        ) : (
          <div
            className={cn(
              "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white shadow-sm",
              avatarColor(conversation.participant?._id ?? "x"),
            )}
          >
            {getInitials(name)}
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-emerald-500" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-semibold leading-tight">{name}</h2>
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </button>

      <div className="flex items-center gap-0.5">
        <button className="hidden h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-primary sm:flex">
          <Phone className="h-5 w-5" />
        </button>
        <button className="hidden h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-primary sm:flex">
          <Video className="h-5 w-5" />
        </button>
        <button
          onClick={onInfo}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
        >
          <Info className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

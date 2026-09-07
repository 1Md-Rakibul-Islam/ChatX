"use client";

import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  formatTime,
  formatDateSeparator,
  sameDay,
} from "@/lib/date-time.utils";
import type { IMessage } from "@/types/chat.interface";
import { Check, CheckCheck } from "lucide-react";

interface IMessageListProps {
  messages: IMessage[];
  senderNames: Record<string, string>;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  currentUserId: string;
}

export function MessageList({
  messages,
  senderNames,
  loading,
  error,
  onRetry,
  currentUserId,
}: IMessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isPinnedToBottom = useRef(true);
  const conversationId = messages[0]?.conversation;

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    isPinnedToBottom.current = distanceFromBottom < 80;
  }, []);

  useEffect(() => {
    if (isPinnedToBottom.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
    isPinnedToBottom.current = true;
  }, [conversationId]);

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-3 overflow-hidden p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex",
              i % 2 === 0 ? "justify-end" : "justify-start",
            )}
          >
            <div className="h-16 w-48 animate-pulse rounded-2xl bg-secondary" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <p className="text-sm font-medium text-destructive">{error}</p>
        <button
          onClick={onRetry}
          className="mt-3 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
        >
          Try again
        </button>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
          <span className="text-2xl">💬</span>
        </div>
        <p className="text-base font-semibold">No messages yet</p>
        <p className="mt-1 max-w-xs text-sm text-muted-foreground">
          Send the first message to get the conversation going.
        </p>
      </div>
    );
  }

  let lastDate = "";

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-1">
        {messages.map((msg, i) => {
          const isOwn = msg.sender === currentUserId;
          const showDateSeparator = !sameDay(
            lastDate || msg.createdAt,
            msg.createdAt,
          );
          // eslint-disable-next-line react-hooks/immutability
          if (showDateSeparator) lastDate = msg.createdAt;
          const prevMsg = messages[i - 1];
          const nextMsg = messages[i + 1];
          const isGroupedTop =
            prevMsg &&
            prevMsg.sender === msg.sender &&
            sameDay(prevMsg.createdAt, msg.createdAt);
          const isGroupedBottom =
            nextMsg &&
            nextMsg.sender === msg.sender &&
            sameDay(nextMsg.createdAt, msg.createdAt);

          return (
            <div key={msg._id}>
              {showDateSeparator && (
                <div className="my-3 flex items-center justify-center">
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                    {formatDateSeparator(msg.createdAt)}
                  </span>
                </div>
              )}
              <MessageBubble
                msg={msg}
                isOwn={isOwn}
                senderName={senderNames[msg.sender]}
                showSender={!isOwn && !isGroupedTop}
                groupedTop={!!isGroupedTop}
                groupedBottom={!!isGroupedBottom}
              />
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

function MessageBubble({
  msg,
  isOwn,
  senderName,
  showSender,
  groupedTop,
  groupedBottom,
}: {
  msg: IMessage;
  isOwn: boolean;
  senderName?: string;
  showSender: boolean;
  groupedTop: boolean;
  groupedBottom: boolean;
}) {
  return (
    <div
      className={cn(
        "flex animate-message-in",
        isOwn ? "justify-end" : "justify-start",
        groupedTop ? "mt-0.5" : "mt-2",
      )}
    >
      <div
        className={cn(
          "flex max-w-[78%] flex-col sm:max-w-[70%]",
          isOwn ? "items-end" : "items-start",
        )}
      >
        {showSender && (
          <span className="mb-1 px-1 text-xs font-semibold text-primary">
            {senderName}
          </span>
        )}
        <div
          className={cn(
            "relative px-3.5 py-2.5 text-sm leading-relaxed shadow-sm",
            isOwn ? "chat-bubble-out" : "chat-bubble-in",
            // Rounded corners with grouping
            isOwn
              ? cn(
                  "rounded-2xl rounded-br-md",
                  groupedTop && "rounded-br-2xl",
                  groupedBottom && "rounded-tr-md",
                )
              : cn(
                  "rounded-2xl rounded-bl-md",
                  groupedTop && "rounded-bl-2xl",
                  groupedBottom && "rounded-tl-md",
                ),
          )}
        >
          <p className="whitespace-pre-wrap wrap-break-word">{msg.text}</p>
          <div
            className={cn(
              "mt-0.5 flex items-center gap-1 text-[10px]",
              isOwn
                ? "justify-end text-white/70"
                : "justify-end text-muted-foreground",
            )}
          >
            <span>{formatTime(msg.createdAt)}</span>
            {isOwn &&
              msg.status &&
              (msg.status === "read" ? (
                <CheckCheck className="h-3 w-3" />
              ) : msg.status === "delivered" ? (
                <CheckCheck className="h-3 w-3 opacity-60" />
              ) : (
                <Check className="h-3 w-3 opacity-60" />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

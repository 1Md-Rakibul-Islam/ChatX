"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Smile } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  onTyping?: () => void;
}

const EMOJIS = [
  "😀",
  "😂",
  "😊",
  "👍",
  "❤️",
  "🎉",
  "🔥",
  "👏",
  "🙏",
  "😎",
  "🤔",
  "👀",
];

export function MessageInput({
  onSend,
  disabled,
  onTyping,
}: MessageInputProps) {
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);

  function autoResize() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }

  useEffect(() => {
    autoResize();
  }, [text]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        setShowEmoji(false);
      }
    }
    if (showEmoji) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showEmoji]);

  function handleSubmit() {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
    setShowEmoji(false);
    requestAnimationFrame(() => textareaRef.current?.focus());
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value);
    onTyping?.();
  }

  return (
    <div className="relative border-t border-border bg-card px-3 py-3 sm:px-4">
      {showEmoji && (
        <div
          ref={emojiRef}
          className="absolute bottom-full left-3 mb-2 rounded-2xl border border-border bg-popover p-2 shadow-xl sm:left-4"
        >
          <div className="grid grid-cols-6 gap-1">
            {EMOJIS?.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  setText((prev) => prev + emoji);
                  textareaRef.current?.focus();
                }}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-xl transition-transform hover:scale-110 hover:bg-secondary"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-end gap-2">
        <div className="flex items-end gap-1">
          <button
            onClick={() => setShowEmoji((s) => !s)}
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
              showEmoji
                ? "bg-secondary text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <Smile className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 items-end rounded-2xl border border-input bg-secondary/50 px-3.5 py-2 transition-colors focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/20">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="max-h-30 flex-1 resize-none bg-transparent text-sm leading-relaxed outline-none placeholder:text-muted-foreground"
            disabled={disabled}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={disabled || !text.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-sky-500 to-cyan-600 text-white shadow-md shadow-sky-500/25 transition-all hover:brightness-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

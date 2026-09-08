import {
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Search,
  Send,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";

type DemoMode = "direct" | "group";
type Message = { text: string; time: string; own?: boolean };

const directMessages: Message[] = [
  {
    text: "Did you get a chance to look at the new direction?",
    time: "10:42 AM",
  },
  {
    text: "I did. The rhythm feels much clearer now.",
    time: "10:43 AM",
    own: true,
  },
  {
    text: "Perfect. I’ll share the final details this afternoon.",
    time: "10:44 AM",
  },
];

const groupMessages: Message[] = [
  { text: "The launch checklist is ready for a final pass.", time: "9:18 AM" },
  {
    text: "I’m on it. The onboarding flow is looking sharp.",
    time: "9:20 AM",
    own: true,
  },
  { text: "Nice. Let’s keep the momentum going.", time: "9:21 AM" },
];

export function ProductPreview({ mode }: { mode: DemoMode }) {
  const isGroup = mode === "group";
  const messages = isGroup ? groupMessages : directMessages;

  return (
    <div
      className="relative z-10 grid h-[460px] grid-cols-1 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/10 sm:grid-cols-[220px_1fr]"
      aria-label="ChatX product preview"
    >
      {/* Sidebar */}
      <aside className="hidden flex-col gap-3 border-r border-border bg-muted/40 p-4 sm:flex">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <MessageCircle size={13} />
          </span>
          ChatX
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-2 text-xs text-muted-foreground">
          <Search size={12} />
          <span>Search chats</span>
          <kbd className="ml-auto rounded border border-border bg-muted px-1 text-[0.65rem]">
            ⌘ K
          </kbd>
        </div>
        <div className="mt-1 text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
          Recent
        </div>
        <div
          className={`flex items-center gap-2 rounded-lg p-2 transition-colors ${!isGroup ? "bg-primary/10" : "hover:bg-muted/60"}`}
        >
          <Avatar initials="AM" size="sm" />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold">Alex Morgan</div>
            <div className="truncate text-[0.7rem] text-muted-foreground">
              Perfect, thanks!
            </div>
          </div>
          <time className="text-[0.65rem] text-muted-foreground">10:44</time>
        </div>
        <div
          className={`flex items-center gap-2 rounded-lg p-2 transition-colors ${isGroup ? "bg-primary/10" : "hover:bg-muted/60"}`}
        >
          <div className="flex -space-x-2">
            <Avatar initials="FE" size="sm" />
            <Avatar initials="SK" tone="success" size="sm" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold">Frontend crew</div>
            <div className="truncate text-[0.7rem] text-muted-foreground">
              Let’s keep moving
            </div>
          </div>
          <time className="text-[0.65rem] text-muted-foreground">9:21</time>
        </div>
      </aside>

      {/* Chat area */}
      <section className="flex flex-col">
        <header className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Avatar
              initials={isGroup ? "FC" : "AM"}
              tone={isGroup ? "success" : "primary"}
              size="sm"
            />
            <div>
              <div className="text-sm font-semibold">
                {isGroup ? "Frontend crew" : "Alex Morgan"}
              </div>
              <div className="text-[0.7rem] text-success">
                {isGroup ? "4 members" : "Active now"}
              </div>
            </div>
          </div>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="More options"
          >
            <MoreHorizontal size={15} />
          </button>
        </header>

        <div className="scrollbar-thin flex-1 overflow-y-auto p-4">
          <div className="mb-3 text-center">
            <span className="rounded-full bg-muted/60 px-3 py-0.5 text-[0.65rem] text-muted-foreground">
              Today
            </span>
          </div>
          {messages.map((msg) => (
            <div
              key={msg.text}
              className={`mb-3 flex max-w-[80%] items-end gap-2 animate-message-in ${msg.own ? "ml-auto flex-row-reverse" : ""}`}
            >
              {!msg.own && (
                <Avatar
                  initials={isGroup ? "JC" : "AM"}
                  tone={isGroup ? "success" : "primary"}
                  size="sm"
                />
              )}
              <div
                className={`flex flex-col gap-0.5 ${msg.own ? "items-end" : ""}`}
              >
                <div
                  className={`rounded-2xl px-3.5 py-2 text-sm ${
                    msg.own
                      ? "rounded-br-sm bg-chat-bubble-out text-chat-bubble-out-fg"
                      : "rounded-bl-sm bg-chat-bubble-in text-chat-bubble-in-fg"
                  }`}
                >
                  {msg.text}
                </div>
                <time className="px-1 text-[0.6rem] text-muted-foreground">
                  {msg.time}
                </time>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="flex gap-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-typing-dot" />
              <span
                className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-typing-dot"
                style={{ animationDelay: "0.2s" }}
              />
              <span
                className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-typing-dot"
                style={{ animationDelay: "0.4s" }}
              />
            </span>
            Alex is typing
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-border px-4 py-3 text-sm text-muted-foreground">
          <Paperclip size={15} />
          <span className="flex-1">Write a message...</span>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
            aria-label="Send message"
          >
            <Send size={14} />
          </button>
        </div>
      </section>
    </div>
  );
}

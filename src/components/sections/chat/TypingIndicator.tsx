'use client';

export function TypingIndicator({ name }: { name?: string }) {
  return (
    <div className="flex animate-fade-in items-center gap-2 px-4 py-1.5">
      <div className="chat-bubble-in flex items-center gap-1 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
        <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground" />
        <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground" />
        <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground" />
      </div>
      {name && <span className="text-xs text-muted-foreground">{name} is typing...</span>}
    </div>
  );
}

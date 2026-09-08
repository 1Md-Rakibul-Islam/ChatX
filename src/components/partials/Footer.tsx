import { Command, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-border px-6 py-8 text-sm text-muted-foreground">
      <a
        href="#hero-section"
        className="flex items-center gap-2 font-semibold text-foreground"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <MessageCircle size={15} />
        </span>
        Chat<span className="text-primary">X</span>
      </a>
      <span>Conversations, made beautifully simple.</span>
      <span className="flex items-center gap-1.5">
        <Command size={13} /> Built for the way you connect.
      </span>
    </footer>
  );
};

export default Footer;

import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import { ProductPreview } from "./ProductPreview";
import { Avatar } from "@/components/ui/Avatar";

const HeroSection = () => {
  return (
    <section
      id="hero-section"
      className="relative overflow-hidden py-20 lg:py-28"
    >
      <div className="pointer-events-none absolute -right-20 -top-32 h-[480px] w-[480px] rounded-full bg-primary/20 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-[360px] w-[360px] rounded-full bg-success/15 blur-[90px]" />

      <div className="container relative grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />A calmer way
            to connect
          </div>
          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
            Make room for better{" "}
            <em className="font-semibold italic text-primary">
              conversations.
            </em>
          </h1>
          <p className="mt-5 max-w-[460px] text-lg text-muted-foreground">
            ChatX keeps your people, ideas, and momentum in one beautifully
            simple place.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <a
              href="#experience"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 font-medium text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/40"
            >
              Try the experience <ArrowRight size={16} />
            </a>
            <a
              href="#features"
              className="inline-flex items-center gap-1.5 font-medium text-foreground hover:underline"
            >
              See what&lsquo;s inside <ChevronDown size={16} />
            </a>
          </div>
          <div className="mt-10 flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex">
              <Avatar initials="AM" size="sm" />
              <span className="-ml-2">
                <Avatar initials="SK" tone="success" size="sm" />
              </span>
              <span className="-ml-2">
                <Avatar initials="JC" tone="warning" size="sm" />
              </span>
            </div>
            <span>Made for conversations that move work forward.</span>
          </div>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute inset-[-10%] animate-spin-slow rounded-full border border-primary/15" />
          <div className="pointer-events-none absolute inset-[-20%] animate-spin-slow-reverse rounded-full border border-success/10" />

          <ProductPreview mode={"direct"} />

          <div className="absolute right-0 top-[8%] flex animate-float items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium shadow-lg">
            <span className="h-2 w-2 animate-pulse-soft rounded-full bg-success" />
            Live updates
          </div>
          <div
            className="absolute -left-5 bottom-[10%] flex animate-float items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium shadow-lg"
            style={{ animationDelay: "2.5s" }}
          >
            <Sparkles size={14} className="text-primary" />
            Thoughtful by default
          </div>
        </div>
      </div>

      <div className="container mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-6 text-sm text-muted-foreground">
        <span>One space for the conversations that matter</span>
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-primary" />
            Private chats
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-primary" />
            Groups
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-primary" />
            Real-time
          </span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

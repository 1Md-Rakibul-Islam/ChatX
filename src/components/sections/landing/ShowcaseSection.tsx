"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { Check, Circle, Users } from "lucide-react";
import { ProductPreview } from "./ProductPreview";

type DemoMode = "direct" | "group";

const ShowcaseSection = () => {
  const [demoMode, setDemoMode] = useState<DemoMode>("direct");

  return (
    <section
      id="experience"
      className="border-y border-border bg-muted/40 py-24"
    >
      <div className="container grid items-center gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <Reveal>
          <div>
            <div className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />A closer
              look
            </div>
            <h2 className="mb-5 text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">
              See the conversation
              <br />
              <span className="text-primary">come alive.</span>
            </h2>
            <p className="mb-8 max-w-[420px] text-lg text-muted-foreground">
              Switch between a one-to-one chat and a group thread to feel how
              naturally ChatX adapts to the way you work.
            </p>
            <div
              className="mb-8 inline-flex gap-1 rounded-full border border-border bg-card p-1"
              role="tablist"
              aria-label="Preview conversation type"
            >
              <button
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  demoMode === "direct"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setDemoMode("direct")}
                role="tab"
                aria-selected={demoMode === "direct"}
              >
                <Circle size={11} /> Direct chat
              </button>
              <button
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  demoMode === "group"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setDemoMode("group")}
                role="tab"
                aria-selected={demoMode === "group"}
              >
                <Users size={14} /> Group chat
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {[
                "Clear message history",
                "Smart scroll behavior",
                "Built for real-time",
              ]?.map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <Check size={16} className="text-success" /> {item}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={150}>
          <div className="mx-auto max-w-[560px]">
            <ProductPreview mode={demoMode} />
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default ShowcaseSection;

"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Menu, MessageCircle, Moon, Sun, X } from "lucide-react";
import Link from "next/link";

const NAV_ITEMS = [
  { label: "Home", href: "/#hero-section" },
  { label: "Message Chat", href: "/chat" },
  { label: "Features", href: "/#features" },
  { label: "Experience", href: "/#experience" },
  { label: "How it works", href: "/#how-it-works" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link
          href="/#hero-section"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <MessageCircle size={17} />
          </span>
          Chat<span className="text-primary">X</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS?.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setDark((d) => !d)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground"
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link
            href="/chat"
            className="hidden items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 md:inline-flex"
          >
            Open the Chat <ArrowRight size={15} />
          </Link>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-foreground md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-b border-border bg-background px-6 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_ITEMS?.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="border-b border-border/50 py-3 text-sm text-muted-foreground"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/chat"
              className="mt-3 inline-flex items-center gap-1.5 self-start rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              onClick={() => setMenuOpen(false)}
            >
              Open the Chat <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

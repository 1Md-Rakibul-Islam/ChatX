"use client";

import { useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Circle,
  Command,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Search,
  Send,
  Sparkles,
  Users,
  X,
  Zap,
} from "lucide-react";

type DemoMode = "direct" | "group";

type Message = {
  text: string;
  time: string;
  own?: boolean;
};

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

const features = [
  {
    icon: Zap,
    eyebrow: "Always in sync",
    title: "Real-time, without the noise",
    copy: "New messages arrive naturally, so the conversation keeps moving while you stay focused.",
  },
  {
    icon: Users,
    eyebrow: "Made for teams",
    title: "Small chats or big ideas",
    copy: "Move from a private thought to a group conversation without changing how you work.",
  },
  {
    icon: Search,
    eyebrow: "Find your people",
    title: "Start with a simple search",
    copy: "Find a teammate by name or phone number, then get straight to the point.",
  },
];

const steps = [
  [
    "01",
    "Sign in",
    "Enter your name and phone number. No separate registration flow to slow you down.",
  ],
  [
    "02",
    "Find people",
    "Search by name or number and open a conversation in a single click.",
  ],
  [
    "03",
    "Stay in motion",
    "Send messages, create groups, and keep every important thread close.",
  ],
];

function Avatar({
  initials,
  tone = "blue",
  small = false,
}: {
  initials: string;
  tone?: string;
  small?: boolean;
}) {
  return (
    <span className={`avatar avatar-${tone} ${small ? "avatar-small" : ""}`}>
      {initials}
    </span>
  );
}

function ProductPreview({ mode }: { mode: DemoMode }) {
  const isGroup = mode === "group";
  const messages = isGroup ? groupMessages : directMessages;

  return (
    <div className="product-window" aria-label="ChatX product preview">
      <aside className="preview-sidebar">
        <div className="preview-brand">
          <span className="brand-mark">
            <MessageCircle size={14} />
          </span>
          <span>ChatX</span>
        </div>
        <div className="preview-search">
          <Search size={12} />
          <span>Search chats</span>
          <kbd>⌘ K</kbd>
        </div>
        <div className="preview-label">Recent</div>
        <div className={`preview-conversation ${!isGroup ? "active" : ""}`}>
          <Avatar initials="AM" small />
          <span className="presence" />
          <div>
            <strong>Alex Morgan</strong>
            <small>Perfect, thanks!</small>
          </div>
          <time>10:44</time>
        </div>
        <div className={`preview-conversation ${isGroup ? "active" : ""}`}>
          <span className="avatar avatar-stack avatar-small">
            <Avatar initials="FE" small />
            <Avatar initials="SK" small />
          </span>
          <div>
            <strong>Frontend crew</strong>
            <small>Let’s keep moving</small>
          </div>
          <time>9:21</time>
        </div>
      </aside>
      <section className="preview-chat">
        <header className="preview-chat-header">
          <div className="chat-person">
            <Avatar
              initials={isGroup ? "FC" : "AM"}
              tone={isGroup ? "green" : "blue"}
              small
            />
            <div>
              <strong>{isGroup ? "Frontend crew" : "Alex Morgan"}</strong>
              <small>{isGroup ? "4 members" : "Active now"}</small>
            </div>
          </div>
          <div className="icon-button">
            <MoreHorizontal size={15} />
          </div>
        </header>
        <div className="message-area">
          <div className="date-divider">
            <span>Today</span>
          </div>
          {messages.map((message) => (
            <div
              className={`message-row ${message.own ? "own" : ""}`}
              key={message.text}
            >
              {!message.own && (
                <Avatar
                  initials={isGroup ? "JC" : "AM"}
                  tone={isGroup ? "green" : "blue"}
                  small
                />
              )}
              <div className="bubble-wrap">
                <div className="message-bubble">{message.text}</div>
                <time>{message.time}</time>
              </div>
            </div>
          ))}
          <div className="typing">
            <span />
            <span />
            <span /> Alex is typing
          </div>
        </div>
        <div className="preview-composer">
          <Paperclip size={15} />
          <span>Write a message...</span>
          <button aria-label="Send message">
            <Send size={14} />
          </button>
        </div>
      </section>
    </div>
  );
}

function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [demoMode, setDemoMode] = useState<DemoMode>("direct");

  const closeMenu = () => setMenuOpen(false);

  return (
    <main>
      <nav className="nav container">
        <a className="brand" href="#top" onClick={closeMenu}>
          <span className="brand-mark">
            <MessageCircle size={17} />
          </span>
          <span>
            Chat<span className="brand-x">X</span>
          </span>
        </a>
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <a href="#features" onClick={closeMenu}>
            Features
          </a>
          <a href="#experience" onClick={closeMenu}>
            Experience
          </a>
          <a href="#how-it-works" onClick={closeMenu}>
            How it works
          </a>
          <a
            className="nav-cta mobile-cta"
            href="#experience"
            onClick={closeMenu}
          >
            Open the demo <ArrowRight size={15} />
          </a>
        </div>
        <a className="nav-cta desktop-cta" href="#experience">
          Open the demo <ArrowRight size={15} />
        </a>
        <button
          className="menu-button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <section className="hero" id="top">
        <div className="hero-glow glow-one" />
        <div className="hero-glow glow-two" />
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow light">
              <span className="eyebrow-dot" />A calmer way to connect
            </div>
            <h1>
              Make room for better <em>conversations.</em>
            </h1>
            <p className="hero-intro">
              ChatX keeps your people, ideas, and momentum in one beautifully
              simple place.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#experience">
                Try the experience <ArrowRight size={16} />
              </a>
              <a className="text-link" href="#features">
                See what’s inside <ChevronDown size={16} />
              </a>
            </div>
            <div className="hero-note">
              <div className="mini-avatars">
                <Avatar initials="AM" small />
                <Avatar initials="SK" tone="green" small />
                <Avatar initials="JC" tone="orange" small />
              </div>
              <span>Made for conversations that move work forward.</span>
            </div>
          </div>
          <div className="hero-preview-wrap">
            <div className="preview-orbit orbit-one" />
            <div className="preview-orbit orbit-two" />
            <ProductPreview mode={demoMode} />
            <div className="floating-card floating-top">
              <span className="live-dot" />
              Live updates
            </div>
            <div className="floating-card floating-bottom">
              <Sparkles size={14} />
              <span>Thoughtful by default</span>
            </div>
          </div>
        </div>
        <div className="hero-bottom-line container">
          <span>One space for the conversations that matter</span>
          <div>
            <span className="line-dot" />
            Private chats <span className="line-dot" />
            Groups <span className="line-dot" />
            Real-time
          </div>
        </div>
      </section>

      <section className="section intro-section" id="features">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                The good kind of simple
              </div>
              <h2>
                Everything clicks
                <br />
                <span>into place.</span>
              </h2>
            </div>
            <p>
              Less hunting. Less switching. More of the conversations that make
              a difference.
            </p>
          </div>
          <div className="feature-grid">
            {features.map(({ icon: Icon, eyebrow, title, copy }) => (
              <article className="feature-card" key={title}>
                <div className="feature-icon">
                  <Icon size={19} />
                </div>
                <div className="eyebrow">{eyebrow}</div>
                <h3>{title}</h3>
                <p>{copy}</p>
                <a href="#experience">
                  Explore <ArrowRight size={14} />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section showcase-section" id="experience">
        <div className="container showcase-grid">
          <div className="showcase-copy">
            <div className="eyebrow">
              <span className="eyebrow-dot" />A closer look
            </div>
            <h2>
              See the conversation
              <br />
              <span>come alive.</span>
            </h2>
            <p>
              Switch between a one-to-one chat and a group thread to feel how
              naturally ChatX adapts to the way you work.
            </p>
            <div
              className="mode-switch"
              role="tablist"
              aria-label="Preview conversation type"
            >
              <button
                className={demoMode === "direct" ? "selected" : ""}
                onClick={() => setDemoMode("direct")}
                role="tab"
                aria-selected={demoMode === "direct"}
              >
                <Circle size={11} />
                Direct chat
              </button>
              <button
                className={demoMode === "group" ? "selected" : ""}
                onClick={() => setDemoMode("group")}
                role="tab"
                aria-selected={demoMode === "group"}
              >
                <Users size={14} />
                Group chat
              </button>
            </div>
            <div className="showcase-checks">
              <span>
                <Check size={14} />
                Clear message history
              </span>
              <span>
                <Check size={14} />
                Smart scroll behavior
              </span>
              <span>
                <Check size={14} />
                Built for real-time
              </span>
            </div>
          </div>
          <div className="showcase-preview">
            <ProductPreview mode={demoMode} />
          </div>
        </div>
      </section>

      <section className="section process-section" id="how-it-works">
        <div className="container">
          <div className="process-intro">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              No learning curve
            </div>
            <h2>
              From hello to <span>in sync.</span>
            </h2>
            <p>A focused flow that gets out of your way.</p>
          </div>
          <div className="steps">
            {steps.map(([number, title, copy]) => (
              <article className="step" key={number}>
                <span className="step-number">{number}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-glow" />
        <div className="container cta-inner">
          <div className="eyebrow light">
            <span className="eyebrow-dot" />
            Your next conversation starts here
          </div>
          <h2>
            Good things happen
            <br />
            when people <em>connect.</em>
          </h2>
          <a className="button button-primary" href="#experience">
            Open ChatX <ArrowRight size={16} />
          </a>
        </div>
      </section>
      <footer className="footer container">
        <a className="brand" href="#top">
          <span className="brand-mark">
            <MessageCircle size={15} />
          </span>
          <span>
            Chat<span className="brand-x">X</span>
          </span>
        </a>
        <span>Conversations, made beautifully simple.</span>
        <span className="footer-right">
          <Command size={13} /> Built for the way you connect.
        </span>
      </footer>
    </main>
  );
}

export default HomePage;

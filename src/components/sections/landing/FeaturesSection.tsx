import { ArrowRight, Search, Users, Zap } from "lucide-react";
import Reveal from "./Reveal";

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

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24">
      <div className="container">
        <Reveal>
          <div className="mb-16 grid items-end gap-6 md:grid-cols-[1.2fr_1fr] md:gap-12">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                The good kind of simple
              </div>
              <h2 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">
                Everything clicks
                <br />
                <span className="text-primary">into place.</span>
              </h2>
            </div>
            <p className="max-w-[380px] text-lg text-muted-foreground">
              Less hunting. Less switching. More of the conversations that make
              a difference.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {features?.map(({ icon: Icon, eyebrow, title, copy }, i) => (
            <Reveal key={title} delay={i * 120} className="h-full">
              <article className="group h-full rounded-2xl border border-border bg-card p-8 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon size={20} />
                </div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {eyebrow}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{title}</h3>
                <p className="mb-5 text-muted-foreground">{copy}</p>
                <a
                  href="#experience"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary"
                >
                  Explore <ArrowRight size={14} />
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

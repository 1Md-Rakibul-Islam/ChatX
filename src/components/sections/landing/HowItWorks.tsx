import Reveal from "./Reveal";

const steps: [string, string, string][] = [
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

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24">
      <div className="container">
        <Reveal>
          <div className="mx-auto mb-16 max-w-[560px] text-center">
            <div className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              No learning curve
            </div>
            <h2 className="mb-4 text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">
              From hello to <span className="text-primary">in sync.</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              A focused flow that gets out of your way.
            </p>
          </div>
        </Reveal>
        <div className="grid gap-8 md:grid-cols-3">
          {steps?.map(([number, title, copy], i) => (
            <Reveal key={number} delay={i * 120} className="h-full">
              <article className="flex h-full gap-5 rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/40">
                <span className="text-2xl font-bold leading-none text-primary/50">
                  {number}
                </span>
                <div>
                  <h3 className="mb-2 text-lg font-semibold">{title}</h3>
                  <p className="text-muted-foreground">{copy}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

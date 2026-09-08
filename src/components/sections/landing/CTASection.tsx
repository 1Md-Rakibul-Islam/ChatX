import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="relative overflow-hidden py-24 text-center">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[100px]" />
      <div className="container relative">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Your next conversation starts here
        </div>
        <h2 className="mb-8 text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">
          Good things happen
          <br />
          when people{" "}
          <em className="font-semibold italic text-primary">connect.</em>
        </h2>
        <a
          href="#experience"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 font-medium text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/40"
        >
          Open ChatX <ArrowRight size={16} />
        </a>
      </div>
    </section>
  );
};

export default CTASection;

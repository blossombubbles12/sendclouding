import { Section } from "@/components/layout/section";
import { Grid } from "@/components/layout/grid";
import { Reveal } from "@/components/motion/reveal";
import { Counter } from "@/components/about/counter";

const stats = [
  { value: 2000, suffix: "+", label: "Businesses Served" },
  { value: 50, suffix: "K+", label: "Orders Delivered" },
  { value: 36, suffix: "", label: "States Covered" },
  { value: 10, suffix: "+", label: "Years of Service" },
];

export function CompanyStats() {
  return (
    <Section background="primary" spacing="lg">
      <div className="flex flex-col gap-14 lg:flex-row lg:items-center lg:gap-20">
        <Reveal className="w-full lg:max-w-sm">
          <p className="text-caption font-semibold uppercase tracking-widest text-secondary">
            By the numbers
          </p>
          <h2 className="text-section-heading mt-3 text-white">
            A track record built on trust
          </h2>
          <p className="mt-4 text-white/80">
            Behind every print lies a growing community of businesses and individuals who
            rely on Send Clouding for quality they can count on.
          </p>
        </Reveal>

        <Reveal delay={120} className="flex-1">
          <Grid cols={2} gap="lg">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8"
              >
                <Counter
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                  decimals={0}
                />
              </div>
            ))}
          </Grid>
        </Reveal>
      </div>
    </Section>
  );
}

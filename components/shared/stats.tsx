import { Section } from "@/components/layout/section";
import { Grid } from "@/components/layout/grid";
import { Reveal } from "@/components/motion/reveal";

const stats = [
  { value: "2,000+", label: "Businesses served" },
  { value: "50K+", label: "Orders delivered" },
  { value: "500+", label: "Cities & towns covered" },
  { value: "24hr", label: "Fastest turnaround" },
];

export function Stats() {
  return (
    <Section background="primary" spacing="md">
      <Grid cols={4} gap="lg">
        {stats.map((stat, index) => (
          <Reveal key={stat.label} delay={index * 70} className="text-center">
            <p className="text-4xl font-bold tracking-tight text-secondary sm:text-5xl">{stat.value}</p>
            <p className="text-secondary mt-2 text-sm font-medium text-white/75">{stat.label}</p>
          </Reveal>
        ))}
      </Grid>
    </Section>
  );
}

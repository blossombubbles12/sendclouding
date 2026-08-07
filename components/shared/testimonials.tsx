import { Quote } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Grid } from "@/components/layout/grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { Rating } from "@/components/ui/rating";
import { Reveal } from "@/components/motion/reveal";

const testimonials = [
  {
    name: "Chioma Okonkwo",
    role: "Founder, Luxe Events, Lagos",
    quote:
      "Signages.ng printed our event banners and backdrops for a 500-guest conference. The quality was outstanding, and delivery was right on schedule.",
    rating: 5,
  },
  {
    name: "Emeka Nnamdi",
    role: "Marketing Director, Abuja",
    quote:
      "We order all our corporate business cards and stationery from Signages. The design tool is intuitive and the prints are consistently premium.",
    rating: 5,
  },
  {
    name: "Fatima Yusuf",
    role: "Small Business Owner, Kano",
    quote:
      "I was blown away by the quality of the custom t-shirts they printed for my brand launch. The colors popped and the fabric quality was exceptional.",
    rating: 4.5,
  },
];

export function Testimonials() {
  return (
    <Section background="white" spacing="lg" pattern="dots">
      <Reveal>
        <SectionHeading
          eyebrow="Testimonials"
          title="Trusted by businesses across Nigeria"
          description="See why thousands of businesses choose Signages.ng for their printing and signage needs."
        />
      </Reveal>
      <Grid cols={3} gap="lg" className="mt-14">
        {testimonials.map((testimonial, index) => (
          <Reveal key={testimonial.name} delay={index * 80}>
            <figure className="hover-lift flex h-full flex-col rounded-2xl border border-border bg-white p-7">
              <Quote className="h-8 w-8 text-secondary/25" aria-hidden="true" />
              <blockquote className="text-body mt-4 flex-1 text-foreground/90">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <Rating value={testimonial.rating} className="mt-5" />
              <figcaption className="mt-4">
                <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-caption">{testimonial.role}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </Grid>
    </Section>
  );
}

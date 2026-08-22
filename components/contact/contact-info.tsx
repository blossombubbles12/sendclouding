import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ThumbsUp,
  Camera,
  AtSign,
  Globe,
} from "lucide-react";
import { Section } from "@/components/layout/section";
import { Grid } from "@/components/layout/grid";
import { Reveal } from "@/components/motion/reveal";

interface ContactInfoProps {
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  } | null;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  } | null;
  workingHours?: string;
}

const socialIcons = [
  { key: "facebook", icon: ThumbsUp, label: "Facebook" },
  { key: "instagram", icon: Camera, label: "Instagram" },
  { key: "twitter", icon: AtSign, label: "Twitter" },
  { key: "linkedin", icon: Globe, label: "LinkedIn" },
] as const;

export function ContactInfo({
  email,
  phone,
  address,
  socialLinks,
  workingHours = "Mon \u2013 Sat: 8:00 AM \u2013 6:00 PM",
}: ContactInfoProps) {
  const fullAddress = [
    address?.street,
    [address?.city, address?.state].filter(Boolean).join(", "),
    [address?.postalCode, address?.country].filter(Boolean).join(", "),
  ]
    .filter(Boolean)
    .join("\n");

  const cards = [
    {
      icon: Mail,
      title: "Email Us",
      value: email || "info@sendclouding.com",
      note: "We reply within a few hours",
      href: email ? `mailto:${email}` : undefined,
    },
    {
      icon: Phone,
      title: "Call Us",
      value: phone || "+31 20 000 0000",
      note: "Speak directly with our team",
      href: phone ? `tel:${phone.replace(/[\s-]/g, "")}` : undefined,
    },
    {
      icon: MapPin,
      title: "Visit Us",
      value: fullAddress || "Amsterdam, Netherlands",
      note: "Come see our facility",
    },
    {
      icon: Clock,
      title: "Working Hours",
      value: workingHours,
      note: "Open for orders & support",
    },
  ];

  return (
    <Section background="white" spacing="lg">
      <Grid cols={4} gap="lg">
        {cards.map((card, index) => {
          const cardBody = (
            <>
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10 text-secondary transition-all duration-300 group-hover:bg-secondary group-hover:text-white">
                <card.icon className="h-7 w-7" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <h3 className="text-card-title mt-5 text-foreground">{card.title}</h3>
              <p className="mt-2 whitespace-pre-line text-sm font-medium text-foreground">
                {card.value}
              </p>
              <p className="text-caption mt-1">{card.note}</p>
              {card.title === "Email Us" && socialLinks && (
                <div className="mt-5 flex items-center justify-center gap-2">
                  {socialIcons.map((social) => {
                    const href = socialLinks[social.key];
                    if (!href) return null;
                    return (
                      <a
                        key={social.key}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-secondary hover:text-white"
                      >
                        <social.icon className="h-4 w-4" aria-hidden="true" />
                      </a>
                    );
                  })}
                </div>
              )}
            </>
          );

          const inner = (
            <div className="group hover-lift flex h-full flex-col rounded-3xl border border-border bg-white p-7 text-center">
              {cardBody}
            </div>
          );

          return (
            <Reveal key={card.title} delay={index * 70} className="h-full">
              {card.href ? (
                <a href={card.href} className="block h-full">
                  {inner}
                </a>
              ) : (
                inner
              )}
            </Reveal>
          );
        })}
      </Grid>
    </Section>
  );
}

export interface HeroSlideData {
  id: string;
  category: string;
  headline: string;
  description: string;
  image: string;
  imageAlt: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
  trustBadges?: { icon: string; label: string }[];
}

export const heroSlides: HeroSlideData[] = [
  {
    id: "signage",
    category: "Premium Signage",
    headline: "Your brand, bigger and bolder",
    description:
      "Design stunning outdoor banners, signs, and displays that make your business impossible to miss. Professional printing, delivered across the Netherlands and the UK.",
    image: "/signageslide1.png",
    imageAlt: "Premium outdoor signage and banners display",
    primaryCta: {
      label: "Customize Now",
      href: "/products?category=outdoor-banners",
    },
    secondaryCta: {
      label: "View Products",
      href: "/products",
    },
    trustBadges: [
      { icon: "ShieldCheck", label: "Premium Quality" },
      { icon: "Truck", label: "Nationwide Delivery" },
      { icon: "Palette", label: "Free Design Tool" },
    ],
  },
  {
    id: "business",
    category: "Business Printing",
    headline: "Everything your business needs to shine",
    description:
      "From business cards to corporate brochures, we print the essentials that make your brand look professional at every touchpoint.",
    image: "/signageslide2.png",
    imageAlt: "Professional business cards and corporate printing",
    primaryCta: {
      label: "Get Started",
      href: "/products?category=business-cards",
    },
    secondaryCta: {
      label: "Corporate Solutions",
      href: "/corporate",
    },
    trustBadges: [
      { icon: "Award", label: "Trusted by 2,000+ businesses" },
      { icon: "Clock", label: "Fast Turnaround" },
      { icon: "Gem", label: "Premium Materials" },
    ],
  },
  {
    id: "merch",
    category: "Brand Merchandise",
    headline: "Wear your brand with pride",
    description:
      "Custom t-shirts, branded mugs, caps, and tote bags. High-quality promotional products that turn your customers into brand ambassadors.",
    image: "/signageslide3.png",
    imageAlt: "Custom branded merchandise and promotional products",
    primaryCta: {
      label: "Design Your Merch",
      href: "/products?category=t-shirts",
    },
    secondaryCta: {
      label: "Browse All",
      href: "/products",
    },
  },
];

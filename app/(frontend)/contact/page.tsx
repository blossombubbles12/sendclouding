import type { Metadata } from "next";
import {
  ContactHero,
  ContactInfo,
  ContactForm,
  ContactCTA,
} from "@/components/contact";
import { Newsletter } from "@/components/shared/newsletter";
import { getSiteSettings } from "@/lib/get-globals";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Contact Us | AquaBest Brands",
  description:
    "Get in touch with AquaBest Brands. Questions, wholesale orders, or feedback — reach out to our friendly team and we'll respond promptly.",
  openGraph: {
    title: "Contact Us | AquaBest Brands",
    description: "Reach out to AquaBest Brands for questions, wholesale orders, or feedback.",
    type: "website",
  },
};

export default async function ContactPage() {
  const siteSettings = await getSiteSettings();

  const contactEmail =
    (siteSettings.contactEmail as string | undefined) || "info@aquaBestbrands.com";
  const contactPhone = siteSettings.contactPhone as string | undefined;
  const address = siteSettings.address as
    | { street?: string; city?: string; state?: string; postalCode?: string; country?: string }
    | null
    | undefined;
  const socialLinks = siteSettings.socialLinks as
    | {
        facebook?: string;
        instagram?: string;
        twitter?: string;
        linkedin?: string;
      }
    | null
    | undefined;

  return (
    <>
      <ContactHero />
      <ContactInfo
        email={contactEmail}
        phone={contactPhone}
        address={address}
        socialLinks={socialLinks}
      />
      <ContactForm />
      <ContactCTA />
      <Newsletter />
    </>
  );
}
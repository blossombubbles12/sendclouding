"use client";

import * as React from "react";
import { ContactHero } from "@/components/contact/contact-hero";
import { ContactInfo } from "@/components/contact/contact-info";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactCTA } from "@/components/contact/contact-cta";

export default function ContactClient() {
  return (
    <>
      <ContactHero />
      <ContactInfo />
      <ContactForm />
      <ContactCTA />
    </>
  );
}
"use client";

import * as React from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

export function Newsletter() {
  const [submitted, setSubmitted] = React.useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <Section background="snow" spacing="md" pattern="splash">
      <Reveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-white">
          <Mail className="h-6 w-6" aria-hidden="true" />
        </span>
        <h2 className="text-section-heading mt-6 text-foreground">Stay in the loop</h2>
        <p className="text-body mt-3">
          Product updates, design tips, and exclusive offers for subscribers. No spam, just good stuff.
        </p>

        {submitted ? (
          <div className="mt-8 flex items-center gap-2 rounded-full bg-secondary/10 px-5 py-3 text-sm font-medium text-secondary-700">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Thanks for subscribing. Check your inbox soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row">
            <Input
              type="email"
              required
              placeholder="Enter your email"
              aria-label="Email address"
              className="h-12 flex-1"
            />
            <Button type="submit" size="lg" className="shrink-0 bg-secondary text-white hover:bg-secondary-600">
              Subscribe
            </Button>
          </form>
        )}
      </Reveal>
    </Section>
  );
}

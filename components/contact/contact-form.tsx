"use client";

import * as React from "react";
import { Loader2, CheckCircle, Send } from "lucide-react";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { submitContactMessage } from "@/lib/contact";

const subjects = [
  { value: "General Enquiry", label: "General Enquiry" },
  { value: "Bulk / Corporate Order", label: "Bulk / Corporate Order" },
  { value: "Signage & Banners", label: "Signage & Banners" },
  { value: "Business Printing", label: "Business Printing" },
  { value: "Custom Apparel", label: "Custom Apparel & Merch" },
  { value: "Other", label: "Other" },
];

export function ContactForm() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [subject, setSubject] = React.useState("General Enquiry");
  const [message, setMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await submitContactMessage({ name, email, phone, subject, message });

    setLoading(false);
    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error || "Something went wrong. Please try again.");
    }
  }

  return (
    <Section background="muted" spacing="lg">
      <Reveal>
        <SectionHeading
          eyebrow="Get In Touch"
          title="Send us a message"
          description="Fill out the form and our team will get back to you as soon as possible."
        />
      </Reveal>

      <Reveal delay={100} className="mx-auto mt-12 max-w-3xl">
        <div className="rounded-[2rem] border border-border bg-white p-6 shadow-sm sm:p-10">
          {submitted ? (
            <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                <CheckCircle className="h-8 w-8" aria-hidden="true" />
              </span>
              <h2 className="text-2xl font-semibold text-foreground">Message sent</h2>
              <p className="text-body max-w-sm">
                Thank you, {name.split(" ")[0] || "friend"}. We&apos;ve received your
                message and will respond shortly.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSubmitted(false);
                  setName("");
                  setEmail("");
                  setPhone("");
                  setSubject("General Enquiry");
                  setMessage("");
                }}
              >
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                    autoComplete="name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 800 000 0000"
                    autoComplete="tel"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <select
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-input bg-white px-4 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {subjects.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you?"
                  required
                />
              </div>

              {error && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button type="submit" size="lg" disabled={loading} className="w-full bg-secondary text-white hover:bg-secondary-600 sm:w-auto">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message <Send className="ml-2 h-4 w-4" aria-hidden="true" />
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </Reveal>
    </Section>
  );
}

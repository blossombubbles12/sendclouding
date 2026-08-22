import Image from "next/image";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export interface PolicySection {
  heading: string;
  body?: string;
  items?: string[];
}

export interface PolicyPageProps {
  title: string;
  description?: string;
  lastUpdated?: string;
  sections: PolicySection[];
}

function SectionBlock({ section }: { section: PolicySection }) {
  return (
    <section aria-label={section.heading} className="scroll-mt-28">
      <h2 className="text-card-title text-foreground sm:text-xl">{section.heading}</h2>
      {section.body && <p className="text-body mt-3">{section.body}</p>}
      {section.items && section.items.length > 0 && (
        <ul className="mt-4 space-y-3">
          {section.items.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              <span className="text-body">{item}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/**
 * Shared premium layout for legal / policy pages: hero with breadcrumb,
 * then an editorial-style content column.
 */
export function PolicyPage({ title, description, lastUpdated, sections }: PolicyPageProps) {
  return (
    <section className="bg-white">
      <div className="relative overflow-hidden bg-primary-900 pb-20 pt-28 text-white sm:pt-32">
        <div aria-hidden="true" className="absolute inset-0">
          <Image
            src="/coveragebg.png"
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover object-center opacity-30"
          />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_70%_at_20%_0%,rgb(0_174_239/0.2),transparent)]"
        />
        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[{ label: title }]}
            className="[&_*]:!text-white/70"
          />
          <h1 className="text-page-title mt-6 text-white">{title}</h1>
          {description && (
            <p className="mt-4 max-w-2xl text-lg text-white/80">{description}</p>
          )}
          {lastUpdated && (
            <p className="mt-4 text-sm font-medium text-white/60">
              Last updated: {lastUpdated}
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-12">
          {sections.map((section) => (
            <SectionBlock key={section.heading} section={section} />
          ))}
        </div>
      </div>
    </section>
  );
}
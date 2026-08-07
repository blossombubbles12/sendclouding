import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export interface SubpageHeroProps {
  title: string;
  description?: string;
  eyebrow?: string;
}

export function SubpageHero({ title, description, eyebrow }: SubpageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-primary-900 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_70%_at_20%_0%,rgb(249_115_22/0.15),transparent)]"
      />
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-14 pt-24 sm:px-6 sm:pt-28 lg:px-8">
        <Breadcrumbs items={[{ label: title }]} className="[&_*]:!text-white/60" />
        {eyebrow && (
          <p className="mt-6 text-caption font-semibold uppercase tracking-widest text-secondary">
            {eyebrow}
          </p>
        )}
        <h1 className="text-page-title mt-3 text-white">{title}</h1>
        {description && (
          <p className="mt-4 max-w-2xl text-lg text-white/75">{description}</p>
        )}
      </div>
    </section>
  );
}

import Image from "next/image";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export function ContactHero() {
  return (
    <section className="relative flex min-h-[440px] items-center overflow-hidden bg-primary-900 sm:min-h-[520px]">
      <div aria-hidden="true" className="absolute inset-0">
        <Image
          src="/coveragebg.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="animate-fade-up [animation-fill-mode:forwards] motion-reduce:animate-none">
          <Breadcrumbs items={[{ label: "Contact Us" }]} className="[&_*]:!text-white/70" />
        </div>
        <h1 className="text-page-title mt-6 max-w-3xl text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.35)] sm:text-hero">
          We&apos;d love to <span className="text-secondary">hear from you</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85 sm:text-xl">
          Questions, bulk orders, or feedback — our team is ready to help. Reach out
          and we&apos;ll get back to you promptly.
        </p>
      </div>
    </section>
  );
}

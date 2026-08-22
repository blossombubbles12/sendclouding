import Link from "next/link";
import Image from "next/image";
import { ArrowRight, PackageSearch } from "lucide-react";
import { Container } from "@/components/layout/container";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-primary">
      {/* Background image — anchored right, extends to viewport edge */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/hero-section-home.png"
          alt="Global logistics and shipping operations"
          fill
          priority
          sizes="100vw"
          className="object-cover object-right"
        />
        {/* Dark navy gradient overlay — right to left, darker on the left where text sits */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(2,6,23,0.96) 0%, rgba(15,23,42,0.88) 30%, rgba(15,23,42,0.55) 55%, rgba(15,23,42,0.15) 80%, rgba(15,23,42,0) 100%)",
          }}
        />
        {/* Extra bottom fade for a clean transition into the next section */}
        <div
          className="absolute inset-x-0 bottom-0 h-24"
          style={{
            background: "linear-gradient(to top, rgba(2,6,23,0.9), transparent)",
          }}
        />
      </div>

      <Container className="relative flex min-h-[88vh] items-center py-24 sm:py-28 lg:min-h-[92vh]">
        <div className="max-w-2xl">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-medium text-white/80 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-highlight" aria-hidden="true" />
            Global Logistics · Simple Shipping · Clear Tracking
          </p>

          <h1 className="text-hero text-white [text-shadow:0_2px_24px_rgba(2,6,23,0.45)]">
            Ship Smarter.
            <br />
            Track Anytime.
            <br />
            <span className="text-highlight">Deliver Anywhere.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75 sm:text-xl">
            Reliable logistics solutions that connect people, businesses and communities
            around the world.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/ship"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-highlight px-8 py-4 text-base font-semibold text-primary-950 shadow-lg shadow-highlight/25 transition-all hover:bg-highlight-600 hover:shadow-highlight/40 active:scale-[0.98]"
            >
              Ship Now
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link
              href="/track"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-white/60 hover:bg-white/10 active:scale-[0.98]"
            >
              <PackageSearch className="h-5 w-5" aria-hidden="true" />
              Track a Shipment
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
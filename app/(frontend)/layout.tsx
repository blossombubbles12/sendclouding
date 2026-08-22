import "../globals.css";
import type { Metadata } from "next";
import { AnnouncementBar } from "@/components/shared/announcement-bar";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { MiniCart } from "@/components/shared/mini-cart";
import { RouteLoadingBar } from "@/components/shared/route-loading-bar";
import { AppProviders } from "@/providers";
import { getSiteSettings, getSiteName, getFaviconUrl, getLogoUrl, getLogoAlt } from "@/lib/get-globals";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();
  const siteName = getSiteName(siteSettings);
  const faviconUrl = await getFaviconUrl(siteSettings);

  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: siteSettings?.siteDescription ?? "Modern logistics technology platform. Ship packages, track shipments in real-time, and manage deliveries with confidence.",
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
    openGraph: {
      siteName,
      locale: "en_NL",
      type: "website",
    },
  };
}

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteSettings = await getSiteSettings();

  const siteName = getSiteName(siteSettings);
  const logoUrl = await getLogoUrl(siteSettings);
  const faviconUrl = await getFaviconUrl(siteSettings);
  const logoAlt = getLogoAlt(siteSettings);

  return (
    <AppProviders>
      <RouteLoadingBar />
      <div className="flex min-h-screen flex-col">
        <AnnouncementBar />
        <Header
          siteName={siteName}
          logoUrl={logoUrl}
          logoAlt={logoAlt}
        />
        <main className="flex-1">{children}</main>
        <Footer
          siteName={siteName}
          siteDescription={siteSettings.siteDescription ?? undefined}
          logoUrl={logoUrl}
          logoAlt={logoAlt}
          contactEmail={siteSettings.contactEmail ?? undefined}
          contactPhone={siteSettings.contactPhone ?? undefined}
          address={siteSettings.address as { city?: string; country?: string } | null}
          socialLinks={siteSettings.socialLinks as Record<string, string> | null}
        />
      </div>
      <MiniCart />
    </AppProviders>
  );
}
import "../globals.css";
import { AnnouncementBar } from "@/components/shared/announcement-bar";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { MiniCart } from "@/components/shared/mini-cart";
import { AppProviders } from "@/providers";
import { getSiteSettings } from "@/lib/get-globals";

export const revalidate = 60;

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteSettings = await getSiteSettings();
  const logo = siteSettings.logo as { url?: string; alt?: string } | null;
  // DB-backed /api/media/file/… URLs fail on serverless (no local storage).
  // A real blob URL (https://…) works — use it; otherwise serve the committed static asset.
  const logoUrl = logo?.url && !logo.url.startsWith("/api") ? logo.url : "/logo.jpg.png";

  return (
    <AppProviders>
      <div className="flex min-h-screen flex-col">
        <AnnouncementBar />
        <Header
          siteName={siteSettings.siteName}
          logoUrl={logoUrl}
          logoAlt={logo?.alt ?? siteSettings.siteName}
        />
        <main className="flex-1">{children}</main>
        <Footer
          siteName={siteSettings.siteName}
          siteDescription={siteSettings.siteDescription}
          logoUrl={logoUrl}
          logoAlt={logo?.alt ?? siteSettings.siteName}
          contactEmail={siteSettings.contactEmail}
          contactPhone={siteSettings.contactPhone}
          address={siteSettings.address as { city?: string; country?: string } | null}
          socialLinks={siteSettings.socialLinks as Record<string, string> | null}
        />
      </div>
      <MiniCart />
    </AppProviders>
  );
}

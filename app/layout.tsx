import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { RootLayout as PayloadRootLayout, handleServerFunctions } from "@payloadcms/next/layouts";
import config from "@payload-config";
import * as importMapObject from "./(payload)/admin/importMap.js";
import "@payloadcms/next/css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const importMap = importMapObject.importMap;

export const metadata: Metadata = {
  title: {
    default: "Signages.ng — Design, Personalize & Print Premium Signage",
    template: "%s | Signages.ng",
  },
  description:
    "Signages.ng is Europe's premium print-on-demand platform. Design and customize banners, business cards, signs, promotional materials, and more. Create your design, we print and deliver.",
  keywords: [
    "signage",
    "printing",
    "banners",
    "business cards",
    "custom printing",
    "print on demand",
    "signages",
    "europe printing",
    "design and print",
    "corporate printing",
    "signage europe",
    "custom signs",
  ],
  authors: [{ name: "Signages.ng" }],
  creator: "Signages.ng",
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Signages.ng",
    title: "Signages.ng — Design, Personalize & Print Premium Signage in Europe",
    description:
      "Create custom banners, signs, business cards, and promotional materials. Design online, we print and deliver anywhere in the Netherlands and the UK.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Signages.ng — Premium Print-on-Demand",
    description:
      "Design and customize your signage. Premium quality printing and delivery across the Netherlands and the UK.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

const serverFunction = async (params: { args: Record<string, unknown>; name: string }) => {
  "use server";
  return handleServerFunctions({
    ...params,
    config,
    importMap,
  });
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PayloadRootLayout
      config={config}
      importMap={importMap}
      serverFunction={serverFunction}
      htmlProps={{
        className: `${geistSans.variable} ${geistMono.variable} h-full antialiased`,
        suppressHydrationWarning: true,
      }}
    >
      {children}
    </PayloadRootLayout>
  );
}

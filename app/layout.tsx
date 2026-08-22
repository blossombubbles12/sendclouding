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
    default: "Send Clouding — Courier & Logistics in the Netherlands & UK",
    template: "%s | Send Clouding",
  },
  description:
    "Send Clouding is a modern courier and logistics platform for the Netherlands and the UK. Ship same-day, track every delivery live, and manage freight, fulfilment and returns with confidence.",
  keywords: [
    "courier",
    "logistics",
    "same-day delivery",
    "next-day delivery",
    "express delivery",
    "shipping",
    "freight",
    "parcel delivery",
    "e-commerce fulfilment",
    "package tracking",
    "netherlands",
    "united kingdom",
    "amsterdam",
    "london",
  ],
  authors: [{ name: "Send Clouding" }],
  creator: "Send Clouding",
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Send Clouding",
    title: "Send Clouding — Courier & Logistics in the Netherlands & UK",
    description:
      "Same-day, next-day and international courier delivery across the Netherlands and the UK, with live tracking on every shipment.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Send Clouding — Courier & Logistics",
    description:
      "Courier and logistics services across the Netherlands and the UK. Ship, track and deliver with confidence.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/sendclouding-logo.svg",
    shortcut: "/sendclouding-logo.svg",
    apple: "/sendclouding-logo.svg",
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

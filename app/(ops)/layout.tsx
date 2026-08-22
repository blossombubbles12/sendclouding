import Link from "next/link";
import { Package, Truck, ArrowLeft, MapPin } from "lucide-react";
import "../globals.css";

export const metadata = {
  title: "Shipments | Send Clouding Ops",
  description: "Send Clouding operations dashboard — manage and track shipments.",
};

export default function OpsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/ops/shipments" className="flex items-center gap-2 font-semibold text-slate-900">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
              <Package className="h-5 w-5" aria-hidden="true" />
            </span>
            Send Clouding <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">Ops</span>
          </Link>
          <nav className="flex items-center gap-1">
            <Link
              href="/ops/shipments"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <Truck className="h-4 w-4" aria-hidden="true" />
              Shipments
            </Link>
            <Link
              href="/ship"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to site
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 text-xs text-slate-400 sm:px-6 lg:px-8">
          <span>Send Clouding Operations</span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" aria-hidden="true" />
            Netherlands · United Kingdom
          </span>
        </div>
      </footer>
    </div>
  );
}
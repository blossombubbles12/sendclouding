import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { ShipmentForm } from "@/components/ops/shipments/shipment-form";
import { getShipmentFormOptions } from "@/lib/shipments/options";

export const metadata: Metadata = {
  title: "New Shipment | Send Clouding Ops",
};

export default async function NewShipmentPage() {
  const { locations, methods } = await getShipmentFormOptions();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/ops/shipments" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          All shipments
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">New Shipment</h1>
        <p className="mt-1 text-sm text-slate-500">
          A tracking number is generated automatically on creation.
        </p>
      </div>

      <ShipmentForm mode="create" locations={locations} methods={methods} />
    </div>
  );
}
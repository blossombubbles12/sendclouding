import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { ShipmentForm, type ShipmentFormValues } from "@/components/ops/shipments/shipment-form";
import { getShipmentFormOptions } from "@/lib/shipments/options";
import { getShipmentDetail } from "@/lib/shipments/detail";

export const metadata: Metadata = {
  title: "Edit Shipment | Send Clouding Ops",
};

export default async function EditShipmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [shipment, { locations, methods }] = await Promise.all([
    getShipmentDetail(id),
    getShipmentFormOptions(),
  ]);

  if (!shipment) notFound();

  const initial: ShipmentFormValues = {
    trackingNumber: shipment.trackingNumber,
    senderName: shipment.sender.name,
    senderCompany: shipment.sender.company ?? "",
    senderPhone: shipment.sender.phone,
    senderEmail: shipment.sender.email ?? "",
    recipientName: shipment.recipient.name,
    recipientCompany: shipment.recipient.company ?? "",
    recipientPhone: shipment.recipient.phone,
    recipientEmail: shipment.recipient.email ?? "",
    originId: shipment.originId?.toString() ?? "",
    destinationId: shipment.destinationId?.toString() ?? "",
    deliveryServiceId: shipment.deliveryServiceId?.toString() ?? "",
    estimatedDelivery: shipment.estimatedDelivery
      ? new Date(shipment.estimatedDelivery).toISOString().slice(0, 16)
      : "",
    status: shipment.status,
    packageDescription: shipment.package.description ?? "",
    packageContent: shipment.package.content ?? "",
    packageQuantity: String(shipment.package.quantity ?? 1),
    packageWeight: shipment.package.weight != null ? String(shipment.package.weight) : "",
    packageWeightUnit: shipment.package.weightUnit ?? "kg",
    packageDeclaredValue: shipment.package.declaredValue != null ? String(shipment.package.declaredValue) : "",
    packageReferenceNumber: shipment.package.referenceNumber ?? "",
    packageIsFragile: shipment.package.isFragile ?? false,
    notes: shipment.notes ?? "",
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href={`/ops/shipments/${shipment.id}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to shipment
        </Link>
        <h1 className="mt-2 font-mono text-2xl font-bold tracking-tight text-slate-900">
          Edit {shipment.trackingNumber}
        </h1>
      </div>

      <ShipmentForm mode="edit" shipmentId={shipment.id} locations={locations} methods={methods} initial={initial} />
    </div>
  );
}
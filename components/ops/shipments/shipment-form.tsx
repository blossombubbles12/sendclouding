"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Package, Truck, MapPin } from "lucide-react";
import { SHIPMENT_STATUSES, getShipmentStatusLabel } from "@/lib/shipments/statuses";

export interface LocationOption {
  id: number;
  name: string;
  city: string | null;
  country: string | null;
}

export interface MethodOption {
  id: number;
  name: string;
}

export interface ShipmentFormValues {
  trackingNumber?: string;
  senderName: string;
  senderCompany: string;
  senderPhone: string;
  senderEmail: string;
  recipientName: string;
  recipientCompany: string;
  recipientPhone: string;
  recipientEmail: string;
  originId: string;
  destinationId: string;
  deliveryServiceId: string;
  estimatedDelivery: string;
  status: string;
  packageDescription: string;
  packageContent: string;
  packageQuantity: string;
  packageWeight: string;
  packageWeightUnit: string;
  packageDeclaredValue: string;
  packageReferenceNumber: string;
  packageIsFragile: boolean;
  notes: string;
}

interface ShipmentFormProps {
  mode: "create" | "edit";
  shipmentId?: number;
  locations: LocationOption[];
  methods: MethodOption[];
  initial?: Partial<ShipmentFormValues>;
}

const EMPTY: ShipmentFormValues = {
  senderName: "",
  senderCompany: "",
  senderPhone: "",
  senderEmail: "",
  recipientName: "",
  recipientCompany: "",
  recipientPhone: "",
  recipientEmail: "",
  originId: "",
  destinationId: "",
  deliveryServiceId: "",
  estimatedDelivery: "",
  status: "created",
  packageDescription: "",
  packageContent: "",
  packageQuantity: "1",
  packageWeight: "",
  packageWeightUnit: "kg",
  packageDeclaredValue: "",
  packageReferenceNumber: "",
  packageIsFragile: false,
  notes: "",
};

function SectionCard({ icon: Icon, title, children }: { icon: typeof Package; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
        <Icon className="h-4 w-4" aria-hidden="true" />
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

export function ShipmentForm({ mode, shipmentId, locations, methods, initial }: ShipmentFormProps) {
  const router = useRouter();
  const [values, setValues] = React.useState<ShipmentFormValues>({ ...EMPTY, ...initial });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  function set<K extends keyof ShipmentFormValues>(key: K, value: ShipmentFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      sender: { name: values.senderName, company: values.senderCompany, phone: values.senderPhone, email: values.senderEmail },
      recipient: { name: values.recipientName, company: values.recipientCompany, phone: values.recipientPhone, email: values.recipientEmail },
      origin: values.originId ? Number(values.originId) : undefined,
      destination: values.destinationId ? Number(values.destinationId) : undefined,
      deliveryService: values.deliveryServiceId ? Number(values.deliveryServiceId) : undefined,
      estimatedDelivery: values.estimatedDelivery || null,
      status: values.status,
      package: {
        description: values.packageDescription,
        content: values.packageContent,
        quantity: Number(values.packageQuantity) || 1,
        weight: values.packageWeight ? Number(values.packageWeight) : null,
        weightUnit: values.packageWeightUnit,
        declaredValue: values.packageDeclaredValue ? Number(values.packageDeclaredValue) : null,
        referenceNumber: values.packageReferenceNumber,
        isFragile: values.packageIsFragile,
      },
      notes: values.notes,
    };

    try {
      const url = mode === "create" ? "/api/ops/shipments" : `/api/ops/shipments/${shipmentId}`;
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save shipment");
      }
      router.push(`/ops/shipments/${data.id ?? shipmentId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard icon={Package} title="Sender">
          <div className="space-y-4">
            <Field label="Full name" required>
              <input className={inputClass} value={values.senderName} onChange={(e) => set("senderName", e.target.value)} required />
            </Field>
            <Field label="Company">
              <input className={inputClass} value={values.senderCompany} onChange={(e) => set("senderCompany", e.target.value)} />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Phone" required>
                <input className={inputClass} type="tel" value={values.senderPhone} onChange={(e) => set("senderPhone", e.target.value)} required />
              </Field>
              <Field label="Email">
                <input className={inputClass} type="email" value={values.senderEmail} onChange={(e) => set("senderEmail", e.target.value)} />
              </Field>
            </div>
          </div>
        </SectionCard>

        <SectionCard icon={Truck} title="Recipient">
          <div className="space-y-4">
            <Field label="Full name" required>
              <input className={inputClass} value={values.recipientName} onChange={(e) => set("recipientName", e.target.value)} required />
            </Field>
            <Field label="Company">
              <input className={inputClass} value={values.recipientCompany} onChange={(e) => set("recipientCompany", e.target.value)} />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Phone" required>
                <input className={inputClass} type="tel" value={values.recipientPhone} onChange={(e) => set("recipientPhone", e.target.value)} required />
              </Field>
              <Field label="Email">
                <input className={inputClass} type="email" value={values.recipientEmail} onChange={(e) => set("recipientEmail", e.target.value)} />
              </Field>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard icon={MapPin} title="Route & Service">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Origin" required>
            <select className={inputClass} value={values.originId} onChange={(e) => set("originId", e.target.value)} required>
              <option value="">Select origin…</option>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                  {l.city ? ` — ${l.city}` : ""}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Destination" required>
            <select className={inputClass} value={values.destinationId} onChange={(e) => set("destinationId", e.target.value)} required>
              <option value="">Select destination…</option>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                  {l.city ? ` — ${l.city}` : ""}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Delivery service">
            <select className={inputClass} value={values.deliveryServiceId} onChange={(e) => set("deliveryServiceId", e.target.value)}>
              <option value="">Standard / default…</option>
              {methods.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Estimated delivery">
            <input className={inputClass} type="datetime-local" value={values.estimatedDelivery} onChange={(e) => set("estimatedDelivery", e.target.value)} />
          </Field>
          <Field label="Status">
            <select className={inputClass} value={values.status} onChange={(e) => set("status", e.target.value)}>
              {SHIPMENT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {getShipmentStatusLabel(s)}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </SectionCard>

      <SectionCard icon={Package} title="Package">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Description">
            <input className={inputClass} value={values.packageDescription} onChange={(e) => set("packageDescription", e.target.value)} />
          </Field>
          <Field label="Content details">
            <input className={inputClass} value={values.packageContent} onChange={(e) => set("packageContent", e.target.value)} />
          </Field>
          <Field label="Quantity">
            <input className={inputClass} type="number" min={1} value={values.packageQuantity} onChange={(e) => set("packageQuantity", e.target.value)} />
          </Field>
          <Field label="Weight">
            <input className={inputClass} type="number" min={0} step="0.1" value={values.packageWeight} onChange={(e) => set("packageWeight", e.target.value)} />
          </Field>
          <Field label="Weight unit">
            <select className={inputClass} value={values.packageWeightUnit} onChange={(e) => set("packageWeightUnit", e.target.value)}>
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </Field>
          <Field label="Declared value (€)">
            <input className={inputClass} type="number" min={0} value={values.packageDeclaredValue} onChange={(e) => set("packageDeclaredValue", e.target.value)} />
          </Field>
          <Field label="Reference number">
            <input className={inputClass} value={values.packageReferenceNumber} onChange={(e) => set("packageReferenceNumber", e.target.value)} />
          </Field>
          <label className="flex items-center gap-2 pt-7 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={values.packageIsFragile}
              onChange={(e) => set("packageIsFragile", e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
            />
            Fragile
          </label>
        </div>
      </SectionCard>

      <SectionCard icon={Package} title="Notes">
        <textarea
          rows={3}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          value={values.notes}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="Internal notes…"
        />
      </SectionCard>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-medium text-white shadow-sm hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {mode === "create" ? "Create Shipment" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
"use client";

import * as React from "react";
import { MapPin, Home, Briefcase, Plus, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Address {
  id: string;
  label: string;
  fullName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  return <AddressesContent />;
}

function AddressesContent() {
  const [addresses, setAddresses] = React.useState<Address[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showForm, setShowForm] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  // New address form
  const [label, setLabel] = React.useState("Home");
  const [fullName, setFullName] = React.useState("");
  const [addr, setAddr] = React.useState("");
  const [city, setCity] = React.useState("");
  const [state, setState] = React.useState("");
  const [postalCode, setPostalCode] = React.useState("");
  const [country, setCountry] = React.useState("Nigeria");
  const [phone, setPhone] = React.useState("");

  const fetchAddresses = React.useCallback(async () => {
    try {
      const token = localStorage.getItem("aquabest-token");
      // Find customer by email
      const userRes = await fetch("/api/users/me", { headers: { Authorization: `JWT ${token}` } });
      const userData = await userRes.json();
      const email = userData.user?.email || userData.email;
      if (!email) return;
      const res = await fetch(`/api/customers?where[email][equals]=${encodeURIComponent(email)}&depth=0`, {
        headers: { Authorization: `JWT ${token}` },
      });
      const data = await res.json();
      if (data.docs?.[0]?.addresses) setAddresses(data.docs[0].addresses);
    } catch {} finally { setLoading(false); }
  }, []);

  React.useEffect(() => { fetchAddresses(); }, [fetchAddresses]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("aquabest-token");
      const userRes = await fetch("/api/users/me", { headers: { Authorization: `JWT ${token}` } });
      const userData = await userRes.json();
      const email = userData.user?.email || userData.email;
      const custRes = await fetch(`/api/customers?where[email][equals]=${encodeURIComponent(email)}`, { headers: { Authorization: `JWT ${token}` } });
      const custData = await custRes.json();
      if (custData.docs?.[0]) {
        await fetch(`/api/customers/${custData.docs[0].id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `JWT ${token}` },
          body: JSON.stringify({ addresses: [...addresses, { label, fullName, address: addr, city, state, postalCode, country, phone, isDefault: addresses.length === 0 }] }),
        });
      }
      setShowForm(false);
      fetchAddresses();
    } catch {} finally { setSaving(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-section-heading text-foreground">Saved Addresses</h1>
          <p className="text-body mt-2">Manage your delivery addresses.</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} size="sm">
            <Plus className="mr-1.5 h-4 w-4" /> Add Address
          </Button>
        )}
      </div>
      <Separator className="my-6" />

      {showForm && (
        <div className="mb-8 max-w-lg">
          <form onSubmit={handleSave} className="rounded-2xl border border-border p-6 space-y-4">
            <h3 className="font-semibold text-foreground">New Address</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Label</Label><Input value={label} onChange={e => setLabel(e.target.value)} required /></div>
              <div><Label>Full Name</Label><Input value={fullName} onChange={e => setFullName(e.target.value)} required /></div>
              <div className="col-span-2"><Label>Address</Label><Input value={addr} onChange={e => setAddr(e.target.value)} required /></div>
              <div><Label>City</Label><Input value={city} onChange={e => setCity(e.target.value)} required /></div>
              <div><Label>State</Label><Input value={state} onChange={e => setState(e.target.value)} required /></div>
              <div><Label>Postal Code</Label><Input value={postalCode} onChange={e => setPostalCode(e.target.value)} /></div>
              <div><Label>Country</Label><Input value={country} onChange={e => setCountry(e.target.value)} required /></div>
              <div className="col-span-2"><Label>Phone</Label><Input value={phone} onChange={e => setPhone(e.target.value)} required /></div>
            </div>
            <div className="flex gap-3"><Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Address"}</Button><Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button></div>
          </form>
        </div>
      )}

      {loading ? <p className="text-muted-foreground">Loading...</p> : addresses.length === 0 && !showForm ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <MapPin className="h-10 w-10 text-muted-foreground" />
          <p className="font-medium text-foreground">No addresses saved</p>
          <Button onClick={() => setShowForm(true)} size="sm">Add Your First Address</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((a) => (
            <div key={a.id} className="rounded-2xl border border-border bg-white p-5">
              <div className="flex items-start justify-between">
                <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  {a.label === "Work" ? <Briefcase className="h-4 w-4" /> : <Home className="h-4 w-4" />}
                  {a.label}
                  {a.isDefault && <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[10px] text-primary">Default</span>}
                </span>
              </div>
              <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">{a.fullName}</p>
                <p>{a.address}</p>
                <p>{a.city}, {a.state} {a.postalCode}</p>
                <p>{a.country}</p>
                <p>{a.phone}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

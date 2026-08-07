"use client";

import * as React from "react";
import { Loader2, CheckCircle } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = React.useState(user?.name || "");
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const ok = await updateProfile({ name });
    setSaving(false);
    if (ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
  };

  return (
    <div>
      <h1 className="text-section-heading text-foreground">My Profile</h1>
      <p className="text-body mt-2">Manage your personal information.</p>
      <Separator className="my-6" />
      <form onSubmit={handleSave} className="max-w-lg space-y-5">
        {saved && <div className="flex items-center gap-2 rounded-xl bg-accent/10 px-4 py-3 text-sm text-accent"><CheckCircle className="h-4 w-4" /> Profile updated!</div>}
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={user?.email || ""} disabled className="opacity-60" />
          <p className="mt-1 text-xs text-muted-foreground">Contact support to change your email.</p>
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}

"use client";

import * as React from "react";
import { Loader2, CheckCircle } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const { changePassword, logout } = useAuth();
  const [current, setCurrent] = React.useState("");
  const [newPw, setNewPw] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (newPw !== confirm) { setError("Passwords do not match."); return; }
    if (newPw.length < 8) { setError("New password must be at least 8 characters."); return; }
    setLoading(true);
    const result = await changePassword(current, newPw);
    setLoading(false);
    if (result.success) { setSuccess("Password changed successfully!"); setCurrent(""); setNewPw(""); setConfirm(""); }
    else setError(result.error || "Failed to change password.");
  };

  return (
    <div>
      <h1 className="text-section-heading text-foreground">Account Settings</h1>
      <p className="text-body mt-2">Manage your password and account preferences.</p>
      <Separator className="my-6" />

      <div className="max-w-lg">
        <h2 className="text-lg font-semibold text-foreground">Change Password</h2>
        {error && <div className="mt-3 rounded-xl bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</div>}
        {success && <div className="mt-3 flex items-center gap-2 rounded-xl bg-accent/10 px-4 py-3 text-sm text-accent"><CheckCircle className="h-4 w-4" /> {success}</div>}
        <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
          <div><Label>Current Password</Label><Input type="password" value={current} onChange={e => setCurrent(e.target.value)} required /></div>
          <div><Label>New Password</Label><Input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} required /></div>
          <div><Label>Confirm New Password</Label><Input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required /></div>
          <Button type="submit" disabled={loading}>{loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Changing...</> : "Update Password"}</Button>
        </form>

        <Separator className="my-8" />
        <h2 className="text-lg font-semibold text-foreground">Sign Out</h2>
        <p className="text-sm text-muted-foreground mt-1">Sign out of your account on this device.</p>
        <Button variant="outline" className="mt-4" onClick={async () => await logout()}>
          Sign Out
        </Button>
      </div>
    </div>
  );
}

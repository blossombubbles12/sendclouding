"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Suspense } from "react";

function ResetForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") || "";
  const { resetPassword } = useAuth();
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    const result = await resetPassword(token, password);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => router.push("/auth/login"), 2000);
    } else setError(result.error || "Reset failed");
    setLoading(false);
  };

  if (!token)
    return (
      <p className="text-center text-sm text-destructive">
        Invalid or missing reset token.
      </p>
    );

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-8 rounded-2xl border border-border bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-page-title text-foreground">Reset password</h1>
          <p className="text-body mt-2">Enter your new password</p>
        </div>
        {success && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-secondary/10 px-4 py-3 text-sm font-medium text-secondary-700">
            <CheckCircle className="h-4 w-4" /> Password reset. Redirecting to login...
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-xl bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Minimum 8 characters"
            />
          </div>
          <div>
            <Label htmlFor="confirm">Confirm password</Label>
            <Input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              placeholder="Repeat your password"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-secondary text-white hover:bg-secondary-600"
            size="lg"
            disabled={loading || success}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export function ResetPasswordForm() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md py-16 text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-secondary" />
        </div>
      }
    >
      <ResetForm />
    </Suspense>
  );
}

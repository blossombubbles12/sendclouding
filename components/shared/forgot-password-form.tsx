"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await forgotPassword(email);
    if (result.success) setSent(true);
    else setError(result.error || "Failed to send reset email");
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-md">
      <Link
        href="/auth/login"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to login
      </Link>
      <div className="mb-8 rounded-2xl border border-border bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-page-title text-foreground">Forgot password</h1>
          <p className="text-body mt-2">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>
        {sent && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-secondary/10 px-4 py-3 text-sm font-medium text-secondary-700">
            <CheckCircle className="h-4 w-4" /> Check your email for a reset link.
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-xl bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-secondary text-white hover:bg-secondary-600"
            size="lg"
            disabled={loading || sent}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

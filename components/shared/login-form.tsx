"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const { login, user } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => { if (user) router.replace("/account"); }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    if (result.success) router.replace("/account");
    else setError(result.error || "Invalid email or password");
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-8 rounded-2xl border border-border bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-page-title text-foreground">Welcome back</h1>
          <p className="text-body mt-2">Sign in to your Signages.ng account</p>
        </div>
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
          <div>
            <div className="flex justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/auth/forgot-password"
                className="text-xs font-medium text-secondary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Your password"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-secondary text-white hover:bg-secondary-600"
            size="lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="font-semibold text-secondary hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}

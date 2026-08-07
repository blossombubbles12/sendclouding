"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm() {
  const router = useRouter();
  const { register, user } = useAuth();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => { if (user) router.replace("/account"); }, [user, router]);

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
    const result = await register(name, email, password);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => router.replace("/account"), 1500);
    } else {
      setError(result.error || "Registration failed");
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-8 rounded-2xl border border-border bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-page-title text-foreground">Create your account</h1>
          <p className="text-body mt-2">
            Join Signages.ng and start designing custom prints
          </p>
        </div>
        {success && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-secondary/10 px-4 py-3 text-sm font-medium text-secondary-700">
            <CheckCircle className="h-4 w-4" /> Account created. Redirecting...
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-xl bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your full name"
            />
          </div>
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
            <Label htmlFor="password">Password</Label>
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
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-semibold text-secondary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

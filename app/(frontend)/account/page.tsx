import Link from "next/link";
import { User, Settings, ArrowRight } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-section-heading text-foreground">
        Hello, {user?.name?.split(" ")[0] || "there"}
      </h1>
      <p className="text-body mt-2">Welcome to your Send Clouding dashboard.</p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Link
          href="/account/profile"
          className="group rounded-2xl border border-border bg-white p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
            <User className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-foreground">My Profile</h2>
          <p className="mt-1 text-sm text-muted-foreground">View and update your account details</p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-secondary group-hover:underline">
            View profile <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>

        <Link
          href="/account/settings"
          className="group rounded-2xl border border-border bg-white p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
            <Settings className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-foreground">Settings</h2>
          <p className="mt-1 text-sm text-muted-foreground">Manage your preferences and security</p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent group-hover:underline">
            Open settings <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>
      </div>
    </div>
  );
}
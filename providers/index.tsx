"use client";

import { CartProvider } from "@/providers/cart-provider";
import { AuthProvider } from "@/providers/auth-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </AuthProvider>
  );
}

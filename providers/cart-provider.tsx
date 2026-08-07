"use client";

import * as React from "react";
import type { DesignOptions, DesignProductionMetadata } from "@/lib/design/types";

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image?: string;
  imageAlt?: string;
  /** Unique identity for customized lines. Falls back to product `id`. */
  lineKey?: string;
  /** Whether this line carries a persisted customer design. */
  isCustomized?: boolean;
  designId?: string;
  previewImage?: string;
  previewMediaId?: string;
  designOptions?: DesignOptions;
  productionReady?: boolean;
  /** Opaque design payload that rides along for order creation. */
  productionMetadata?: DesignProductionMetadata;
  templateId?: string;
  templateVersion?: string;
  designJSON?: unknown;
  assets?: { id: string; url?: string }[];
}

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  updateDesignItem: (lineKey: string, patch: Partial<CartItem>) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = React.createContext<CartContextValue | null>(null);

/** Identity used for dedupe: customized lines keyed by designId, else product id. */
function lineIdentity(item: CartItem): string {
  return item.lineKey || item.id;
}

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("aquabest-cart");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("aquabest-cart", JSON.stringify(items));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setItems(loadCart());
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (mounted) saveCart(items);
  }, [items, mounted]);

  const addItem = React.useCallback((item: CartItem) => {
    setItems((prev) => {
      const key = lineIdentity(item);
      const existing = prev.find((i) => lineIdentity(i) === key);
      if (existing) {
        // Merge quantity but preserve the design payload of the incoming line.
        return prev.map((i) => (lineIdentity(i) === key ? { ...i, ...item, quantity: i.quantity + item.quantity } : i));
      }
      return [...prev, item];
    });
    setIsOpen(true);
  }, []);

  const removeItem = React.useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => lineIdentity(i) !== key));
  }, []);

  const updateQuantity = React.useCallback((key: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => lineIdentity(i) !== key));
      return;
    }
    setItems((prev) => prev.map((i) => (lineIdentity(i) === key ? { ...i, quantity: qty } : i)));
  }, []);

  const updateDesignItem = React.useCallback((key: string, patch: Partial<CartItem>) => {
    setItems((prev) => prev.map((i) => (lineIdentity(i) === key ? { ...i, ...patch } : i)));
  }, []);

  const clearCart = React.useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const value = React.useMemo(
    () => ({
      items,
      totalItems,
      subtotal,
      isOpen,
      addItem,
      removeItem,
      updateQuantity,
      updateDesignItem,
      clearCart,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    }),
    [items, totalItems, subtotal, isOpen, addItem, removeItem, updateQuantity, updateDesignItem, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

/** Stable identity exposed for consumers (cart lists, checkout). */
export function cartLineKey(item: CartItem): string {
  return item.lineKey || item.id;
}
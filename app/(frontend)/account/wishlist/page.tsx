"use client";

import * as React from "react";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  return (
    <div>
      <h1 className="text-section-heading text-foreground">My Wishlist</h1>
      <p className="text-body mt-2">Products you&apos;ve saved for later.</p>
      <Separator className="my-6" />
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <Heart className="h-12 w-12 text-muted-foreground" />
        <p className="text-lg font-medium text-foreground">Your wishlist is empty</p>
        <p className="text-sm text-muted-foreground">Tap the heart icon on any product to save it here.</p>
        <Button asChild className="mt-2"><Link href="/products">Browse Products</Link></Button>
      </div>
    </div>
  );
}

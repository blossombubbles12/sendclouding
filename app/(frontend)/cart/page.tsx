import Link from "next/link";
import { PenTool } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { CartItems } from "@/components/shared/cart-items";

export default function CartPage() {
  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <Container>
        <SectionHeading
          align="left"
          eyebrow="Your Cart"
          title="Review your designs"
          className="mb-10"
        />

        <CartItems />
      </Container>
    </section>
  );
}

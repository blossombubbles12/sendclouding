import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CheckoutForm } from "@/components/shared/checkout-form";

export default function CheckoutPage() {
  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <Container>
        <SectionHeading
          align="left"
          eyebrow="Checkout"
          title="Complete your order"
          className="mb-10"
        />
        <CheckoutForm />
      </Container>
    </section>
  );
}

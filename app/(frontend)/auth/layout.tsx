import { Container } from "@/components/layout/container";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="bg-muted py-16 sm:py-20 lg:py-28">
      <Container>
        {children}
      </Container>
    </section>
  );
}

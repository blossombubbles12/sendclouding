import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

export default function NewsLoading() {
  return (
    <Section background="muted" spacing="md" className="pb-0">
      <Container>
        <div className="pt-12">
          <div className="h-4 w-40 animate-pulse rounded-full bg-border" />
        </div>
        <div className="mx-auto mt-10 flex max-w-2xl flex-col items-center gap-4 text-center">
          <div className="h-6 w-32 animate-pulse rounded-full bg-border" />
          <div className="h-10 w-3/4 animate-pulse rounded-xl bg-border" />
          <div className="h-5 w-1/2 animate-pulse rounded-xl bg-border" />
        </div>
      </Container>
    </Section>
  );
}

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

export default function ArticleLoading() {
  return (
    <Section background="muted" spacing="md" className="pb-0">
      <Container>
        <div className="pt-12">
          <div className="h-4 w-48 animate-pulse rounded-full bg-border" />
        </div>
        <div className="mx-auto mt-10 max-w-3xl text-center">
          <div className="mx-auto h-6 w-24 animate-pulse rounded-full bg-border" />
          <div className="mx-auto mt-6 h-10 w-full animate-pulse rounded-xl bg-border" />
          <div className="mx-auto mt-3 h-10 w-4/5 animate-pulse rounded-xl bg-border" />
          <div className="mx-auto mt-5 h-5 w-2/3 animate-pulse rounded-xl bg-border" />
        </div>
        <div className="mt-10 h-[420px] animate-pulse rounded-[2rem] bg-border" />
      </Container>
    </Section>
  );
}

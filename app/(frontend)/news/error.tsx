"use client";

import { useEffect } from "react";
import { Newspaper, RotateCw } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export default function NewsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="bg-white py-24">
      <Container size="md" className="flex flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Newspaper className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
        </div>
        <h1 className="text-page-title mt-6 text-foreground">Something went wrong</h1>
        <p className="text-body mt-3 max-w-md">
          We couldn&apos;t load the news. Please try again — if the problem persists, contact our team.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button onClick={reset}>
            <RotateCw className="mr-2 h-4 w-4" aria-hidden="true" />
            Try again
          </Button>
        </div>
      </Container>
    </section>
  );
}
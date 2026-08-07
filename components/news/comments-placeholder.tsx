import { MessageSquare } from "lucide-react";

export function CommentsPlaceholder() {
  return (
    <section id="comments" className="rounded-2xl border border-dashed border-border bg-muted/40 p-8 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <MessageSquare className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="text-section-heading mt-4 text-xl">Join the conversation</h3>
      <p className="text-body mx-auto mt-2 max-w-md">
        Comments are coming soon. In the meantime, share this article on social media or reach out to
        us directly with your thoughts.
      </p>
    </section>
  );
}
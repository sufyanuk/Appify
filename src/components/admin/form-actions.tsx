import { Button, ButtonLink } from "@/components/ui/button";

export function FormActions({
  cancelHref,
  pending,
  submitLabel,
}: {
  cancelHref: string;
  pending: boolean;
  submitLabel: string;
}) {
  return (
    <div className="flex flex-col-reverse gap-2 border-t border-line pt-6 sm:flex-row sm:justify-end">
      <ButtonLink href={cancelHref} variant="secondary">
        Cancel
      </ButtonLink>
      <Button type="submit" disabled={pending} className="sm:min-w-36">
        {pending ? "Saving…" : submitLabel}
      </Button>
    </div>
  );
}

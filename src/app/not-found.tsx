import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <span className="text-5xl" aria-hidden="true">🥡</span>
      <h1 className="mt-4 text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-muted">The page you&apos;re looking for doesn&apos;t exist or was removed.</p>
      <ButtonLink href="/" className="mt-6">
        Back to home
      </ButtonLink>
    </main>
  );
}

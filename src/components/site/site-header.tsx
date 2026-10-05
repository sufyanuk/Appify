import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-500 text-white">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M4 13h16a8 8 0 0 1-16 0ZM8 9c0-2 1.5-2 1.5-4M12 9c0-2 1.5-2 1.5-4M16 9c0-2 1.5-2 1.5-4" />
        </svg>
      </span>
      Appify
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-canvas/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="flex items-center gap-1 text-sm font-medium">
          <Link href="/recipes" className="rounded-full px-3 py-2 text-muted hover:bg-stone-100 hover:text-ink">
            Recipes
          </Link>
          <Link href="/order" className="rounded-full bg-ink px-4 py-2 text-white hover:bg-stone-700">
            Order
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line/70">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted sm:flex-row sm:px-6">
        <p>© {new Date().getFullYear()} Appify. Made with care.</p>
        <Link href="/admin" className="hover:text-ink">
          Staff login
        </Link>
      </div>
    </footer>
  );
}

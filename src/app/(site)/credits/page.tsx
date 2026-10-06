import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { FoodImage } from "@/components/ui/food-image";
import { PHOTO_CREDITS, commonsPage, commonsPhoto } from "@/lib/photos";

export const metadata: Metadata = { title: "Photo credits" };

export default function CreditsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <PageHeader
        eyebrow="Thank you"
        title="Photo credits"
        description="The sample food photos come from Wikimedia Commons and are used under their free licences. Tap a photo to see its photographer and licence."
      />
      <ul className="mt-8 divide-y divide-line overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-line/60">
        {PHOTO_CREDITS.map(({ dish, file }) => (
          <li key={file + dish}>
            <a
              href={commonsPage(file)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 px-4 py-3 hover:bg-stone-50"
            >
              <FoodImage src={commonsPhoto(file, 160)} alt="" className="h-12 w-12 shrink-0 rounded-lg text-xl" />
              <span className="min-w-0 flex-1">
                <span className="block font-medium">{dish}</span>
                <span className="block truncate text-xs text-muted">{file} · Wikimedia Commons ↗</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

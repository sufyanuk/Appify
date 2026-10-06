import Link from "next/link";
import { PHOTOS, commonsPhoto } from "@/lib/photos";
import { FoodImage } from "@/components/ui/food-image";
import { ArrowRightIcon, BagIcon, BookIcon } from "@/components/ui/icons";

const choices = [
  {
    href: "/recipes",
    title: "Browse Easy Recipes",
    text: "Simple Kokni dishes to cook in your own kitchen.",
    image: commonsPhoto(PHOTOS.homeVadaPav, 1600),
    icon: BookIcon,
  },
  {
    href: "/order",
    title: "Order Food Items",
    text: "Fresh homemade thalis, seafood, vade and more.",
    image: commonsPhoto(PHOTOS.homeBiryani, 1600),
    icon: BagIcon,
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pt-16">
      <section className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium text-brand-600">
          <span lang="mr">घरगुती कोकणी जेवण</span> · Homemade Kokni food in Qatar
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          The taste of the Konkan, cooked at home
        </h1>
        <p className="mt-4 text-base text-muted sm:text-lg">
          Order today&apos;s homemade dishes, or learn to cook easy Kokni recipes yourself.
        </p>
      </section>

      <section className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 sm:gap-6">
        {choices.map(({ href, title, text, image, icon: Icon }, i) => (
          <Link
            key={href}
            href={href}
            className="group overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-line/60 transition duration-300 hover:-translate-y-0.5 hover:shadow-float"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <FoodImage
                src={image}
                alt=""
                eager={i === 0}
                className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-110"
              />
            </div>
            <div className="flex items-center gap-4 p-5 sm:p-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <Icon width={22} height={22} />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-semibold sm:text-xl">{title}</h2>
                <p className="mt-0.5 text-sm text-muted">{text}</p>
              </div>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-100 transition group-hover:bg-ink group-hover:text-white">
                <ArrowRightIcon width={18} height={18} />
              </span>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}

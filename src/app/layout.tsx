import type { Metadata, Viewport } from "next";
import { Geist, Noto_Sans_Devanagari } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
// For the Marathi (Devanagari) touches such as "कोकणी जेवण".
const devanagari = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Kokni Jevan — Homemade Kokni food in Qatar",
    template: "%s · Kokni Jevan",
  },
  description:
    "Order homemade Kokni and Malvani food in Qatar — fish thali, kombdi vade, solkadhi and more — or cook easy Kokni recipes at home.",
};

export const viewport: Viewport = {
  themeColor: "#faf8f5",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} ${devanagari.variable} h-full`}>
      <body className="flex min-h-full flex-col font-sans">
        <Toaster>{children}</Toaster>
      </body>
    </html>
  );
}

import { formatPrice } from "./format";

export type WhatsAppLine = { name: string; priceCents: number; quantity: number };

/** Digits only, as wa.me expects (country code, no "+" or spaces). Empty if unusable. */
export function cleanWhatsAppNumber(raw: string | undefined): string {
  const digits = (raw ?? "").replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15 ? digits : "";
}

export function buildWhatsAppMessage({
  lines,
  totalCents,
  customerName,
  customerPhone,
  notes,
}: {
  lines: WhatsAppLine[];
  totalCents: number;
  customerName: string;
  customerPhone: string;
  notes: string;
}): string {
  const out = ["Hello Kokni Jevan! I'd like to order:", ""];
  for (const l of lines) {
    out.push(`• ${l.quantity} × ${l.name} — ${formatPrice(l.priceCents * l.quantity)}`);
  }
  out.push("", `Total: ${formatPrice(totalCents)}`);
  if (customerName.trim()) out.push(`Name: ${customerName.trim()}`);
  if (customerPhone.trim()) out.push(`Contact: ${customerPhone.trim()}`);
  if (notes.trim()) out.push(`Notes: ${notes.trim()}`);
  return out.join("\n");
}

/**
 * wa.me link that opens WhatsApp with the message ready to send. Without a
 * business number WhatsApp asks the customer which chat to send it to.
 */
export function whatsAppUrl(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

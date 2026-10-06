import { db } from "@/lib/db";

/** Serves admin-uploaded food photos. Images never change, so cache forever. */
export async function GET(_request: Request, ctx: RouteContext<"/api/images/[id]">) {
  const { id } = await ctx.params;
  const image = id.length <= 64 ? await db.uploadedImage.findUnique({ where: { id } }) : null;
  if (!image) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(image.data), {
    headers: {
      "Content-Type": image.mimeType,
      "Content-Length": String(image.size),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

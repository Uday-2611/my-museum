import { handleUpload } from "@vercel/blob/client";
import { getAdmin } from "@/lib/auth/session";

export async function POST(request: Request) {
  const admin = await getAdmin();
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const result = await handleUpload({
      body, request,
      onBeforeGenerateToken: async () => ({ allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"], maximumSizeInBytes: 20 * 1024 * 1024, addRandomSuffix: true }),
      onUploadCompleted: async () => {},
    });
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Upload failed." }, { status: 400 });
  }
}

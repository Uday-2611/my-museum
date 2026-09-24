import { getAuth } from "@/lib/auth/server";
import { isAdminEmail } from "@/lib/auth/admin";
export async function GET(request: Request) { return getAuth().handler(request); }
export async function POST(request: Request) {
  const path = new URL(request.url).pathname;
  const allowed = new Set([
    "/api/auth/email-otp/send-verification-otp",
    "/api/auth/sign-in/email-otp",
    "/api/auth/sign-out",
  ]);
  if (!allowed.has(path)) return Response.json({ error: "Not found." }, { status: 404 });
  if (path !== "/api/auth/sign-out") {
    const body = await request.clone().json().catch(() => null);
    if (!body || typeof body.email !== "string" || !isAdminEmail(body.email)) {
      return Response.json({ error: "Studio access is for the administrator only." }, { status: 403 });
    }
  }
  return getAuth().handler(request);
}

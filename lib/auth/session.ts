import "server-only";
import { headers } from "next/headers";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getAuth } from "./server";
import { isAdminEmail } from "./admin";

export const getAdmin = cache(async () => {
  if (!process.env.DATABASE_URL) return null;
  const result = await getAuth().api.getSession({ headers: await headers() });
  return result?.user && isAdminEmail(result.user.email) ? result.user : null;
});
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/studio/login");
  return admin;
}

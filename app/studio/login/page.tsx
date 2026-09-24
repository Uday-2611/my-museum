import { redirect } from "next/navigation";
import { LoginForm } from "@/components/studio/login-form";
import { getAdmin } from "@/lib/auth/session";
export const metadata = { title: "Studio sign in" };
export default async function LoginPage() {
  if (await getAdmin()) redirect("/studio");
  return <main className="login-page">{process.env.DATABASE_URL && process.env.RESEND_API_KEY ? <LoginForm /> : <div className="studio-setup"><p className="eyebrow">PRIVATE ACCESS</p><h1>Studio</h1><p>Studio is for admin purposes only. Email sign-in is being configured.</p></div>}</main>;
}

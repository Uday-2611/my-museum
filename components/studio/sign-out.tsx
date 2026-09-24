"use client";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";
export function SignOut() { const router = useRouter(); return <button className="row-link" style={{ border: 0, background: "transparent", padding: 0 }} onClick={async () => { await authClient.signOut(); router.push("/"); router.refresh(); }}>SIGN OUT</button>; }

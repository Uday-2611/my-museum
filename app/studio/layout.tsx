import Link from "next/link";
import { SignOut } from "@/components/studio/sign-out";
import { getAdmin } from "@/lib/auth/session";

export const metadata = { robots: { index: false, follow: false } };
export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdmin();
  return <div className="studio-page"><header className="studio-header"><Link href="/" className="wordmark">MY MUSEUM <span style={{ fontWeight: 400, marginLeft: 10 }}>/ STUDIO</span></Link><div className="studio-header-links"><span className="studio-private-label">ADMIN ONLY</span><Link href="/">VIEW MUSEUM ↗</Link>{admin && <SignOut />}</div></header>{children}</div>;
}

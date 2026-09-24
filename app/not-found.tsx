import Link from "next/link";
export default function NotFound() { return <main className="not-found"><Link className="wordmark" href="/">MY MUSEUM</Link><div><p className="eyebrow">NOT FOUND</p><h1>This room doesn’t exist.</h1><Link href="/">Back to the museum ↗</Link></div></main>; }

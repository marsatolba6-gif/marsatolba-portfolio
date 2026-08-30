import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="not-found-page">
      <header>
        <Link href="/">M° / MARS ATOLBA</Link>
        <span>AI AUTOMATION SPECIALIST</span>
      </header>
      <section>
        <p>404 / ROUTE NOT MAPPED</p>
        <h1>THE SYSTEM<br />LOST THIS PATH.</h1>
        <p>The page may have moved, but the work is still connected.</p>
        <div>
          <Link href="/">RETURN HOME ↗</Link>
          <Link href="/#work">VIEW SYSTEMS ↘</Link>
        </div>
      </section>
      <footer><span>UNDERSTAND</span><span>MAP</span><span>BUILD</span><span>TEST</span><span>IMPROVE</span></footer>
    </main>
  );
}

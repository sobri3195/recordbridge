import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'RecordBridge Demo',
  description: 'Schema-less EHR/SIMRS translator demo.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-lg font-semibold text-blue-600">RecordBridge</Link>
            <div className="flex gap-4 text-sm">
              <Link href="/demo" className="hover:text-blue-600">Demo</Link>
              <Link href="/how-it-works" className="hover:text-blue-600">How it works</Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}

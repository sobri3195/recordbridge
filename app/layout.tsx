import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'RecordBridge Demo - Schema-less EHR/SIMRS Translator',
  description: 'Powerful healthcare data interoperability for Indonesia. Connect EHR, SIMRS, BPJS, SATUSEHAT data into unified patient records.',
  keywords: 'EHR, SIMRS, healthcare, Indonesia, BPJS, SATUSEHAT, interoperability, medical records',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-lg shadow-sm">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link href="/" className="group flex items-center gap-2 text-xl font-bold text-blue-600">
              <span className="text-2xl">🏥</span>
              <span className="group-hover:text-blue-700 transition-colors">RecordBridge</span>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">Demo</span>
            </Link>
            <div className="hidden gap-6 md:flex">
              <Link href="/" className="flex items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors">
                <span>🏠</span>
                Home
              </Link>
              <Link href="/features" className="flex items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors">
                <span>🚀</span>
                Core Features
              </Link>
              <Link href="/demo" className="flex items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors">
                <span>🧪</span>
                Demo
              </Link>
              <Link href="/how-it-works" className="flex items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors">
                <span>📖</span>
                How it works
              </Link>
            </div>
            <div className="flex gap-2 md:hidden">
              <Link href="/demo" className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white">
                Demo
              </Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-7xl px-6 py-8">
          {children}
        </main>
        <footer className="mt-16 border-t border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏥</span>
                  <span className="text-lg font-bold text-slate-800">RecordBridge</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Schema-less EHR/SIMRS translator untuk integritas data kesehatan Indonesia.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">Core Features</h4>
                <ul className="mt-2 space-y-1 text-sm text-slate-600">
                  <li>• Auto-Connector Engine</li>
                  <li>• AI Mapping Engine</li>
                  <li>• Health Standardization</li>
                  <li>• Real-Time Sync</li>
                  <li>• API Gateway</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">Integrations</h4>
                <ul className="mt-2 space-y-1 text-sm text-slate-600">
                  <li>• SATUSEHAT</li>
                  <li>• BPJS Kesehatan</li>
                  <li>• SIMRS Lokal</li>
                  <li>• Excel/CSV</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">Use Cases</h4>
                <ul className="mt-2 space-y-1 text-sm text-slate-600">
                  <li>• Military Healthcare</li>
                  <li>• Hospital Networks</li>
                  <li>• Clinic Referrals</li>
                  <li>• Multi-facility Care</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 border-t border-slate-200 pt-4 text-center text-sm text-slate-500">
              <p>© 2026 RecordBridge Demo - Healthcare Interoperability for Indonesia</p>
              <p className="mt-1">⚠️ Demo purposes only - Not for production use</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
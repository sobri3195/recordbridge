import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import Logo from '@/components/Logo';

export const metadata: Metadata = {
  title: 'RecordBridge Demo - Schema-less EHR/SIMRS Translator',
  description: 'Powerful healthcare data interoperability for Indonesia. Connect EHR, SIMRS, BPJS, SATUSEHAT data into unified patient records.',
  keywords: 'EHR, SIMRS, healthcare, Indonesia, BPJS, SATUSEHAT, interoperability, medical records',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-lg shadow-slate-200/50">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link href="/" className="group flex items-center gap-3">
              <div className="relative">
                <Logo size="sm" variant="full" className="transition-opacity duration-300 group-hover:opacity-90" />
                <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              </div>
              <span className="hidden rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 px-3 py-1 text-xs font-bold text-emerald-700 md:inline-block shadow-sm">
                Demo
              </span>
            </Link>
            <div className="hidden gap-2 md:flex">
              {[
                { href: '/', icon: '🏠', label: 'Home' },
                { href: '/features', icon: '🚀', label: 'Core Features' },
                { href: '/demo', icon: '🧪', label: 'Demo' },
                { href: '/how-it-works', icon: '📖', label: 'How it works' }
              ].map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className="group flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition-all duration-300 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-700 hover:shadow-md"
                >
                  <span className="transition-transform duration-300 group-hover:scale-110">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
            <div className="flex gap-2 md:hidden">
              <Link href="/demo" className="btn-primary px-4 py-2 text-sm">
                Demo
              </Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-7xl px-6 py-8">
          {children}
        </main>
        <footer className="mt-16 border-t border-slate-200/60 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
          <div className="mx-auto max-w-7xl px-6 py-12">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Logo size="sm" variant="full" />
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Schema-less EHR/SIMRS translator untuk integritas data kesehatan Indonesia.
                </p>
                <div className="flex gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <div className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="h-2 w-2 rounded-full bg-lime-500 animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
              <div>
                <h4 className="mb-4 font-bold text-slate-800">Core Features</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2 transition-colors hover:text-emerald-700">
                    <span className="text-emerald-500">•</span>
                    Auto-Connector Engine
                  </li>
                  <li className="flex items-center gap-2 transition-colors hover:text-emerald-700">
                    <span className="text-emerald-500">•</span>
                    AI Mapping Engine
                  </li>
                  <li className="flex items-center gap-2 transition-colors hover:text-emerald-700">
                    <span className="text-emerald-500">•</span>
                    Health Standardization
                  </li>
                  <li className="flex items-center gap-2 transition-colors hover:text-emerald-700">
                    <span className="text-emerald-500">•</span>
                    Real-Time Sync
                  </li>
                  <li className="flex items-center gap-2 transition-colors hover:text-emerald-700">
                    <span className="text-emerald-500">•</span>
                    API Gateway
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 font-bold text-slate-800">Integrations</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2 transition-colors hover:text-emerald-700">
                    <span className="text-emerald-500">•</span>
                    SATUSEHAT
                  </li>
                  <li className="flex items-center gap-2 transition-colors hover:text-emerald-700">
                    <span className="text-emerald-500">•</span>
                    BPJS Kesehatan
                  </li>
                  <li className="flex items-center gap-2 transition-colors hover:text-emerald-700">
                    <span className="text-emerald-500">•</span>
                    SIMRS Lokal
                  </li>
                  <li className="flex items-center gap-2 transition-colors hover:text-emerald-700">
                    <span className="text-emerald-500">•</span>
                    Excel/CSV
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 font-bold text-slate-800">Use Cases</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2 transition-colors hover:text-emerald-700">
                    <span className="text-purple-500">•</span>
                    Military Healthcare
                  </li>
                  <li className="flex items-center gap-2 transition-colors hover:text-emerald-700">
                    <span className="text-purple-500">•</span>
                    Hospital Networks
                  </li>
                  <li className="flex items-center gap-2 transition-colors hover:text-emerald-700">
                    <span className="text-purple-500">•</span>
                    Clinic Referrals
                  </li>
                  <li className="flex items-center gap-2 transition-colors hover:text-emerald-700">
                    <span className="text-purple-500">•</span>
                    Multi-facility Care
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-10 border-t border-slate-200 pt-6 text-center">
              <p className="text-sm text-slate-600">
                © 2026 RecordBridge Demo - <span className="font-semibold text-emerald-700">Healthcare Interoperability for Indonesia</span>
              </p>
              <p className="mt-2 text-xs text-slate-500">⚠️ Demo purposes only - Not for production use</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

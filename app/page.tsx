import { LandingHero } from "./_components/landing/hero";
import { LandingFeatures } from "./_components/landing/features";
import { LandingFAQ } from "./_components/landing/faq";
import { LandingFooter } from "./_components/landing/footer";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-slate-950 font-sans">
      <header className="border-b-2 border-black bg-white dark:bg-slate-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-black text-2xl tracking-tighter text-slate-900 dark:text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#000]">
              <span className="text-white font-bold text-lg leading-none">T</span>
            </div>
            TypeZen
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/editor" className="font-bold text-sm bg-blue-600 text-white px-5 py-2 rounded-full border-2 border-black shadow-[2px_2px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000] transition-all">
              进入编辑器
            </Link>
          </nav>
        </div>
      </header>

      <div className="flex-1">
        <LandingHero />
        <LandingFeatures />
        <LandingFAQ />
      </div>

      <LandingFooter />
    </main>
  );
}

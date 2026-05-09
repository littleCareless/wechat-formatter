import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function LandingHero() {
  return (
    <section className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center text-center">
      <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-slate-900 dark:text-white" style={{ textShadow: "4px 4px 0px rgba(0,0,0,0.1)" }}>
        TypeZen
      </h1>
      <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl font-medium">
        极简 Markdown 转微信排版。AI 一键优化排版结构，72套精美模板，一键复制发布。
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          href="/editor" 
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg border-2 border-black shadow-[4px_4px_0px_#000] transition-transform active:translate-y-1 active:shadow-[0px_0px_0px_#000]"
        >
          免费开始排版 <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}

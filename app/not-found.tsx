import Link from "next/link";
import { SITE_BRAND } from "@/lib/site-config";
import { LandingHeader } from "./_components/landing/header";
import { LandingFooter } from "./_components/landing/footer";

export const metadata = { title: "404 页面未找到" };

export default function NotFoundPage() {
  return (
    <main className="min-h-screen flex flex-col neo-app-bg font-sans">
      <LandingHeader />

      <div className="flex-1 w-full flex items-center justify-center px-6 py-12">
        <section className="neo-panel-strong max-w-xl w-full text-center p-8 sm:p-12">
          <div className="mb-6">
            <span className="inline-block font-black text-7xl sm:text-8xl tracking-tighter text-(--neo-pink)">
              404
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-(--neo-ink) mb-4">
            页面未找到
          </h1>

          <p className="text-base font-bold text-(--neo-muted) leading-relaxed mb-8">
            抱歉，你访问的页面不存在或已被移除。
            <br />
            你可以返回首页，或直接开始排版。
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="neo-button neo-button-primary px-6 py-2.5 text-sm w-full sm:w-auto"
            >
              返回首页
            </Link>
            <Link
              href="/editor"
              className="neo-button neo-button-secondary px-6 py-2.5 text-sm w-full sm:w-auto"
            >
              进入编辑器
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t-[3px] border-(--neo-ink)">
            <p className="text-xs font-bold text-(--neo-muted)">
              {SITE_BRAND} · 专注公众号的 Markdown 排版工具
            </p>
          </div>
        </section>
      </div>

      <LandingFooter />
    </main>
  );
}

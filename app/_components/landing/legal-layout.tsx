"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { LandingHeader } from "./header";
import { LandingFooter } from "./footer";

interface LegalLayoutProps {
  title: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

export function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col neo-app-bg font-sans">
      <LandingHeader />

      <div className="flex-1 w-full">
        <div className="max-w-3xl mx-auto px-6 py-12 sm:py-16">
          <section className="neo-panel p-6 sm:p-10">
            <button
              type="button"
              onClick={() => router.back()}
              className="neo-button neo-button-ghost px-3 py-1.5 text-sm font-bold flex items-center gap-2 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              返回
            </button>

            <div className="mb-8 border-b-[3px] border-(--neo-ink) pb-6">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-(--neo-ink) mb-2">
                {title}
              </h1>
              {lastUpdated && (
                <p className="text-sm font-bold text-(--neo-muted)">更新日期：{lastUpdated}</p>
              )}
            </div>

            <div className="space-y-8">{children}</div>
          </section>
        </div>
      </div>

      <LandingFooter />
    </main>
  );
}

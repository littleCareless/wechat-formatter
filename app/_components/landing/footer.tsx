"use client";

import { CircleDollarSign, Code, ExternalLink, Heart, Info } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SITE_BRAND } from "@/lib/site-config";
import { RewardModal } from "../reward-modal";

export function LandingFooter() {
  const [showReward, setShowReward] = useState(false);

  return (
    <footer className="bg-(--neo-app-header) text-(--neo-ink) border-t-[3px] border-(--neo-ink) py-12 px-6">
      <RewardModal open={showReward} onClose={() => setShowReward(false)} />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          {/* Brand & About */}
          <div className="md:col-span-5 space-y-6">
            <Link
              href="/"
              className="font-black text-3xl tracking-tighter text-(--neo-ink) flex items-center gap-3 group"
            >
              <img
                src="/logo.png"
                alt="TypeZen Logo"
                width={40}
                height={40}
                className="w-10 h-10 p-1 border-[3px] border-(--neo-ink) bg-white shadow-[3px_3px_0px_var(--neo-shadow-core)] transition-transform group-hover:scale-105"
              />
              {SITE_BRAND}
            </Link>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-(--neo-pink)">
                <Info className="w-5 h-5" />
                <h3 className="text-lg font-black uppercase text-(--neo-ink)">关于我们</h3>
              </div>
              <p className="text-base font-bold text-(--neo-muted) leading-relaxed">
                {SITE_BRAND} 是一款专为微信公众号设计的 Markdown 智能排版工具。
                我们致力于通过简洁的视觉风格与强大的 AI 智能排版技术，让创作更纯粹，效果更专业。
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-3 space-y-6">
            <h3 className="text-lg font-black uppercase text-(--neo-cyan)">快速导航</h3>
            <ul className="grid grid-cols-1 gap-3">
              <li>
                <Link
                  href="/editor"
                  className="font-bold text-(--neo-muted) hover:text-(--neo-ink) transition-colors flex items-center gap-2 text-sm"
                >
                  <ExternalLink className="w-4 h-4" /> 进入编辑器
                </Link>
              </li>
              <li>
                <Link
                  href="#features"
                  className="font-bold text-(--neo-muted) hover:text-(--neo-ink) transition-colors text-sm"
                >
                  功能特性
                </Link>
              </li>
              <li>
                <Link
                  href="#faq"
                  className="font-bold text-(--neo-muted) hover:text-(--neo-ink) transition-colors text-sm"
                >
                  常见问题
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="md:col-span-4 space-y-6">
            <h3 className="text-lg font-black uppercase text-(--neo-green)">支持与赞赏</h3>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://github.com/mspringjade/wechat-formatter"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="neo-button neo-button-ghost px-4 py-2 flex items-center gap-2 text-sm"
              >
                <Code className="w-4 h-4" /> GitHub 开源
              </a>
              <button
                onClick={() => setShowReward(true)}
                className="neo-button neo-button-pink px-4 py-2 flex items-center gap-2 text-sm"
              >
                <CircleDollarSign className="w-4 h-4" /> 赞赏支持
              </button>
            </div>
            <div className="bg-(--neo-surface) p-3 border-l-4 border-(--neo-pink) border-[3px] border-(--neo-ink) shadow-[3px_3px_0px_var(--neo-shadow-core)]">
              <p className="text-xs font-bold text-(--neo-muted) leading-relaxed">
                如果您觉得 TypeZen 对您有帮助，欢迎在 GitHub 上点个 Star
                或通过赞赏支持我们的持续维护。
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t-[3px] border-(--neo-ink) flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="TypeZen"
              width={20}
              height={20}
              className="w-5 h-5 p-0.5 border-2 border-(--neo-ink) bg-white shadow-[1.5px_1.5px_0px_var(--neo-shadow-core)]"
            />
            <p className="text-(--neo-muted) font-bold text-xs">
              © {new Date().getFullYear()} {SITE_BRAND} (typezen.online) · Made with{" "}
              <Heart className="inline w-3 h-3 text-rose-500 fill-rose-500" />
            </p>
          </div>
          <div className="flex gap-6 text-xs font-bold text-(--neo-muted)">
            <Link href="/" className="hover:text-(--neo-ink) transition-colors">
              隐私政策
            </Link>
            <Link href="/" className="hover:text-(--neo-ink) transition-colors">
              服务条款
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

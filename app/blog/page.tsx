import type { Metadata } from "next";
import Link from "next/link";
import { LandingHeader } from "../_components/landing/header";
import { LandingFooter } from "../_components/landing/footer";
import { blogPosts } from "./_data/posts";
import { BookOpen, Calendar, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog | TypeZen 公众号 Markdown 排版指南与自媒体运营博客",
  description: "探索微信公众号排版美学、Markdown 写作技巧、AI 辅助编辑以及自媒体运营技巧。使用 TypeZen 智能优化排版，让内容传达更完美。",
};

// 分类对应不同的高饱和背景色，增强新粗野风感觉
const categoryColors: Record<string, string> = {
  "排版指南": "bg-(--neo-pink)",
  "AI 创作": "bg-(--neo-cyan)",
  "设计美学": "bg-(--neo-yellow)",
  "技术教程": "bg-(--neo-green)",
};

export default function BlogListingPage() {
  const sortedPosts = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <main className="min-h-screen flex flex-col neo-app-bg font-sans">
      <LandingHeader />

      <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 sm:py-16">
        {/* Page Title Panel */}
        <section className="neo-panel p-8 sm:p-12 mb-12 bg-(--neo-yellow) text-(--neo-ink) relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -z-10" />
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter mb-4 uppercase">
            TypeZen Blog
          </h1>
          <p className="text-lg sm:text-xl font-bold text-(--neo-ink) max-w-3xl leading-relaxed">
            在这里，我们分享关于微信公众号排版的美学探索、Markdown 高效写作、AI 智能优化以及自媒体自动化运营的技术干货与最佳实践。
          </p>
        </section>

        {/* Blog Post Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedPosts.map((post) => {
            const categoryBg = categoryColors[post.category] || "bg-white";
            return (
              <article
                key={post.slug}
                className="neo-panel bg-(--neo-surface) flex flex-col justify-between p-6 hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_var(--neo-shadow-core)] transition-all duration-150"
              >
                <div>
                  {/* Metadata Row */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-xs font-black uppercase text-black px-2.5 py-1 border-2 border-(--neo-ink) ${categoryBg}`}
                    >
                      {post.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-(--neo-muted)">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{post.date}</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h2 className="text-xl sm:text-2xl font-black text-(--neo-ink) mb-3 leading-tight hover:text-(--neo-pink) transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="text-sm font-bold text-(--neo-muted) leading-relaxed mb-6">
                    {post.description}
                  </p>
                </div>

                {/* Read time and link */}
                <div className="pt-4 border-t-2 border-dashed border-(--neo-ink) flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs font-bold text-(--neo-muted)">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.readTime}</span>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="neo-button neo-button-ghost text-xs px-3 py-1.5 flex items-center gap-1 font-black"
                  >
                    阅读全文 <BookOpen className="w-3.5 h-3.5 ml-0.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <LandingFooter />
    </main>
  );
}

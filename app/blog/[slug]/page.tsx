import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LandingHeader } from "../../_components/landing/header";
import { LandingFooter } from "../../_components/landing/footer";
import { blogPosts } from "../_data/posts";
import { Marked } from "marked";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { SITE_BRAND, SITE_URL } from "@/lib/site-config";

type Props = {
  params: Promise<{ slug: string }>;
};

// 预渲染静态参数
export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

// 动态生成元数据以利于 Google SEO 收录
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "文章未找到 | TypeZen",
    };
  }

  const title = `${post.title} | TypeZen Blog`;

  return {
    title,
    description: post.description,
    alternates: {
      canonical: `${SITE_URL}/blog/${post.slug}`,
    },
    openGraph: {
      title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [SITE_BRAND],
    },
  };
}

export default async function BlogPostDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // 使用 marked 解析 Markdown 并过滤/安全渲染
  const markedInstance = new Marked();
  const rawHtml = await markedInstance.parse(post.content);

  return (
    <main className="min-h-screen flex flex-col neo-app-bg font-sans">
      <LandingHeader />

      <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 sm:py-16">
        <article className="neo-panel bg-(--neo-surface) p-6 sm:p-12">
          {/* Back Button */}
          <Link
            href="/blog"
            className="neo-button neo-button-ghost px-4 py-2 text-sm flex items-center gap-2 w-fit mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> 返回 Blog 列表
          </Link>

          {/* Header Section */}
          <header className="border-b-[3px] border-(--neo-ink) pb-8 mb-8">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span className="text-xs font-black uppercase text-black bg-(--neo-pink) px-2.5 py-1 border-2 border-(--neo-ink)">
                {post.category}
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-(--neo-muted)">
                <Calendar className="w-4 h-4" />
                <span>发布于 {post.date}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-(--neo-muted)">
                <Clock className="w-4 h-4" />
                <span>阅读需 {post.readTime}</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tighter text-(--neo-ink) leading-tight mb-4">
              {post.title}
            </h1>
            <p className="text-base sm:text-lg font-bold text-(--neo-muted) leading-relaxed italic bg-black/5 dark:bg-white/5 p-4 border-l-4 border-(--neo-pink)">
              前言概要：{post.description}
            </p>
          </header>

          {/* Article content (HTML from Markdown) */}
          <div
            className="prose-neo text-base sm:text-lg font-medium text-(--neo-ink) leading-relaxed"
            dangerouslySetInnerHTML={{ __html: rawHtml }}
          />
        </article>
      </div>

      <LandingFooter />
    </main>
  );
}

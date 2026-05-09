# Landing Page & Multi-page Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the single-page editor into a multi-page site with a dedicated landing page (`/`) optimized for SEO/AEO and move the core editor tool to `/editor`.

**Architecture:** Create a new `/editor` route by moving the existing `app/page.tsx`. Create new marketing components in `app/_components/landing/` and compose them in a new `app/page.tsx`. Update SEO constants in `lib/site-config.ts` to adhere to strict length limits and keyword focus.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS 4, Lucide React.

---

### Task 1: Update SEO Constants

**Files:**
- Modify: `lib/site-config.ts`

- [ ] **Step 1: Replace contents of `lib/site-config.ts`**

Update the SEO constants to meet the strict 40-50 character description limit and precise titles.

```typescript
/** 站点与品牌常量（metadata、Json-Ld、robots、sitemap 共用） */

export const SITE_HOST = "typezen.online" as const;
export const SITE_URL = \`https://\${SITE_HOST}\` as const;
export const SITE_BRAND = "TypeZen";
export const SITE_PRODUCT_NAME = "公众号一键排版助手";

/** 默认 <title>：首选关键词，极度精简 */
export const SITE_TITLE_DEFAULT = "TypeZen | 微信公众号 Markdown 排版工具";

/**
 * <meta name="description">：严格控制在 40-50 字符左右
 */
export const SITE_DESCRIPTION = "TypeZen: 极简 Markdown 转微信排版。AI 智能排版，72套精美模板，一键复制发布。";

/** Open Graph site_name */
export const SITE_OG_SITE_NAME = "TypeZen";

/** 编辑器页面专属 Title */
export const EDITOR_TITLE = "TypeZen 编辑器 | 实时 Markdown 转微信排版";

/** 编辑器页面专属 Description */
export const EDITOR_DESCRIPTION = "TypeZen 在线编辑器：AI 智能排版，72 套精美模板，本地安全，即开即用。";
```

### Task 2: Move Editor to `/editor`

**Files:**
- Create: `app/editor/page.tsx`
- Create: `app/editor/layout.tsx`

- [ ] **Step 1: Move existing page to editor**

Run the following command to move the file:
```bash
mkdir -p app/editor
mv app/page.tsx app/editor/page.tsx
```

- [ ] **Step 2: Update imports in `app/editor/page.tsx`**

Since the file moved one level deeper, update the relative paths for components, hooks, and lib.

```bash
sed -i '' 's|from "./_components|from "../_components|g' app/editor/page.tsx
sed -i '' 's|from "./_hooks|from "../_hooks|g' app/editor/page.tsx
sed -i '' 's|from "./_lib|from "../_lib|g' app/editor/page.tsx
sed -i '' 's|from "./_types|from "../_types|g' app/editor/page.tsx
sed -i '' 's|from "./template-engine"|from "../template-engine"|g' app/editor/page.tsx
```

- [ ] **Step 3: Create `app/editor/layout.tsx` for Metadata**

```tsx
import type { Metadata } from "next";
import { EDITOR_TITLE, EDITOR_DESCRIPTION } from "@/lib/site-config";

export const metadata: Metadata = {
  title: EDITOR_TITLE,
  description: EDITOR_DESCRIPTION,
};

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
```

### Task 3: Create Landing Page Components

**Files:**
- Create: `app/_components/landing/hero.tsx`
- Create: `app/_components/landing/features.tsx`
- Create: `app/_components/landing/faq.tsx`
- Create: `app/_components/landing/footer.tsx`

- [ ] **Step 1: Create `app/_components/landing/hero.tsx`**

```bash
mkdir -p app/_components/landing
```

```tsx
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
```

- [ ] **Step 2: Create `app/_components/landing/features.tsx`**

```tsx
import { Sparkles, Palette, Shield, Copy, Layout, Zap } from "lucide-react";

const features = [
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "AI 智能排版",
    description: "接入顶级大模型，一键自动修复标题层级、添加空行、规范列表，不改变原意。"
  },
  {
    icon: <Palette className="w-6 h-6" />,
    title: "72 套精美模板",
    description: "涵盖新粗野、极简、商务、文艺、科技、节庆 6 大风格，满足各种发文需求。"
  },
  {
    icon: <Layout className="w-6 h-6" />,
    title: "微信完美兼容",
    description: "全部采用内联 CSS 渲染，完美适配微信公众号后台，不会出现样式丢失。"
  },
  {
    icon: <Copy className="w-6 h-6" />,
    title: "一键复制",
    description: "沉浸式编辑，实时预览，满意后一键复制富文本，直接粘贴至公众号。"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "本地隐私安全",
    description: "支持填入自己的 API Key，数据仅在本地处理，绝不保存你的文章和密钥。"
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "极速体验",
    description: "采用 Next.js 16 构建，页面秒开，无需登录注册，即开即用。"
  }
];

export function LandingFeatures() {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/50 border-y-2 border-black">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-slate-900 dark:text-white">
          为什么选择 TypeZen？
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-8 border-2 border-black shadow-[4px_4px_0px_#000] rounded-xl">
              <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 w-12 h-12 flex items-center justify-center rounded-lg mb-6 border border-blue-200 dark:border-blue-800">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{f.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create `app/_components/landing/faq.tsx`**

```tsx
export function LandingFAQ() {
  const faqs = [
    {
      q: "TypeZen 是免费的吗？",
      a: "是的，TypeZen 目前完全免费提供使用。你可以自由使用所有排版模板和基础编辑功能。"
    },
    {
      q: "AI 排版会消耗我的 Token 吗？",
      a: "TypeZen 支持让你填入自己的 OpenAI、Anthropic 或 OpenRouter API Key，调用直接走你的账户，确保隐私与安全。"
    },
    {
      q: "复制到微信后台样式会乱吗？",
      a: "不会。我们的模板引擎专门针对微信公众号的限制进行了深度优化，确保 100% 还原预览效果。"
    }
  ];

  return (
    <section className="py-24 max-w-3xl mx-auto px-6">
      <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white">常见问题 (FAQ)</h2>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <details key={i} className="group border-2 border-black rounded-lg bg-white dark:bg-slate-800 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between p-6 font-bold cursor-pointer text-lg text-slate-900 dark:text-white">
              {faq.q}
              <span className="transition group-open:rotate-180">
                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
              </span>
            </summary>
            <div className="px-6 pb-6 text-slate-600 dark:text-slate-400">
              <p>{faq.a}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create `app/_components/landing/footer.tsx`**

```tsx
import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t-2 border-black py-12 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="font-black text-2xl tracking-tighter">TypeZen</div>
        <p className="text-slate-500 font-medium">© {new Date().getFullYear()} TypeZen. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/editor" className="text-slate-600 hover:text-black dark:hover:text-white font-medium">进入编辑器</Link>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer nofollow" className="text-slate-600 hover:text-black dark:hover:text-white font-medium">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
```

### Task 4: Create Landing Page (`app/page.tsx`)

**Files:**
- Create: `app/page.tsx`
- Modify: `app/_components/app-header.tsx`

- [ ] **Step 1: Create `app/page.tsx`**

```tsx
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
```

- [ ] **Step 2: Update `app/_components/app-header.tsx`**

Modify `app/_components/app-header.tsx` to wrap the logo in a `Link` component back to `/`.

```bash
sed -i '' 's|<div className="font-black text-2xl tracking-tighter text-slate-900 dark:text-white flex items-center gap-2">|<Link href="/" className="font-black text-2xl tracking-tighter text-slate-900 dark:text-white flex items-center gap-2 hover:opacity-80 transition-opacity">|g' app/_components/app-header.tsx
sed -i '' 's|TypeZen\n        </div>|TypeZen\n        </Link>|g' app/_components/app-header.tsx
```
Then add `import Link from "next/link";` at the top of `app/_components/app-header.tsx`.

### Task 5: AEO & SEO Structure Updates

**Files:**
- Modify: `app/json-ld.tsx`

- [ ] **Step 1: Replace contents of `app/json-ld.tsx` to include FAQ Schema**

```tsx
import { SITE_BRAND, SITE_DESCRIPTION, SITE_URL } from "@/lib/site-config";

export function JsonLd() {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_BRAND,
    url: SITE_URL,
    logo: \`\${SITE_URL}/logo.png\`,
  };

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_BRAND,
    applicationCategory: "WebApplication",
    operatingSystem: "Any",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "TypeZen 是免费的吗？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "是的，TypeZen 目前完全免费提供使用。你可以自由使用所有排版模板和基础编辑功能。"
        }
      },
      {
        "@type": "Question",
        "name": "AI 排版会消耗我的 Token 吗？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "TypeZen 支持让你填入自己的 OpenAI、Anthropic 或 OpenRouter API Key，调用直接走你的账户，确保隐私与安全。"
        }
      },
      {
        "@type": "Question",
        "name": "复制到微信后台样式会乱吗？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "不会。我们的模板引擎专门针对微信公众号的限制进行了深度优化，确保 100% 还原预览效果。"
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([orgSchema, appSchema, faqSchema]),
      }}
    />
  );
}
```

- [ ] **Step 2: Compile Check**

Run `npm run build` to verify there are no import path errors.

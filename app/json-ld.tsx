import { SITE_BRAND, SITE_DESCRIPTION, SITE_URL } from "@/lib/site-config";

export function JsonLd() {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_BRAND,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
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

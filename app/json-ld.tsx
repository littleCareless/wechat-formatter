const SITE_URL = "https://typezen.online";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}/#webapplication`,
      name: "公众号一键排版助手",
      alternateName: "TypeZen",
      url: SITE_URL,
      description: "免费在线Markdown转微信公众号排版工具，提供极简、商务、文艺、科技、节庆5大类共50套精美模板，支持实时预览、一键复制。",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web Browser",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "CNY",
      },
      featureList: [
        "Markdown转微信排版",
        "50套精美模板",
        "实时预览",
        "一键复制发布",
        "5大风格分类",
        "自定义字号行高",
      ],
      screenshot: `${SITE_URL}/logo.png`,
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        ratingCount: "1000",
        bestRating: "5",
        worstRating: "1",
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#softwareapplication`,
      name: "公众号一键排版助手",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "CNY",
      },
      softwareVersion: "1.0",
      fileFormat: "Web Application",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "TypeZen - 公众号一键排版助手",
      description: "Markdown转微信公众号排版工具",
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
      inLanguage: "zh-CN",
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "TypeZen",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
        width: 512,
        height: 512,
      },
      sameAs: [],
    },
  ],
};

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

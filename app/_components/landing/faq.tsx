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
        {faqs.map((faq) => (
          <details key={faq.q} className="group border-2 border-black rounded-lg bg-white dark:bg-slate-800 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between p-6 font-bold cursor-pointer text-lg text-slate-900 dark:text-white">
              {faq.q}
              <span className="transition group-open:rotate-180">
                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                  <title>展开/折叠</title>
                  <path d="M6 9l6 6 6-6"></path>
                </svg>
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

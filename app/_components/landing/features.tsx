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
          {features.map((f) => (
            <div key={f.title} className="bg-white dark:bg-slate-800 p-8 border-2 border-black shadow-[4px_4px_0px_#000] rounded-xl">
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

import { Quote } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  content: string;
  avatar?: string;
  icon?: React.ReactNode;
  color?: string;
}

// 真实数据填充处，目前为空
const testimonials: Testimonial[] = [];

export function LandingTestimonials() {
  const hasData = testimonials.length > 0;

  return (
    <section id="testimonials" className="py-24 bg-(--neo-bg) border-t-[3px] border-(--neo-ink)">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-(--neo-ink) uppercase">
            创作者的声音
          </h2>
          <p className="text-xl font-bold text-(--neo-muted) max-w-2xl mx-auto">
            听听真实用户如何评价 TypeZen 的排版效率与设计风格。
          </p>
        </div>

        {hasData ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="neo-panel p-8 flex flex-col h-full bg-(--neo-surface) group hover:-translate-y-2 transition-transform"
              >
                <div className="mb-6 flex items-center justify-between">
                  <Quote className="w-10 h-10 text-(--neo-ink) opacity-20" />
                  {t.icon && (
                    <div
                      className="w-12 h-12 border-[3px] border-(--neo-ink) flex items-center justify-center shadow-[3px_3px_0px_var(--neo-shadow-core)]"
                      style={{ backgroundColor: t.color }}
                    >
                      {t.icon}
                    </div>
                  )}
                </div>
                <p className="flex-1 text-lg font-bold text-(--neo-ink) italic leading-relaxed mb-8">
                  “{t.content}”
                </p>
                <div className="pt-6 border-t-2 border-(--neo-ink)">
                  <div className="font-black text-(--neo-ink) text-xl">{t.name}</div>
                  <div className="text-sm font-black text-(--neo-muted) uppercase tracking-tighter mt-1">
                    {t.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="neo-panel p-20 flex flex-col items-center justify-center bg-(--neo-surface) border-dashed opacity-60">
            <Quote className="w-16 h-16 text-(--neo-ink) mb-6 opacity-10" />
            <p className="text-2xl font-black text-(--neo-ink) mb-2">正在收集真实创作者反馈</p>
            <p className="font-bold text-(--neo-muted)">
              如果您也喜欢 TypeZen，欢迎联系我们分享您的使用体验
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

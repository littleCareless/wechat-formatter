import {
  SITE_BRAND,
  SITE_CONTACT_EMAIL,
  SITE_HOST,
  SITE_OPERATOR,
  SITE_URL,
} from "@/lib/site-config";
import { LegalLayout } from "../_components/landing/legal-layout";

export const metadata = { title: "隐私政策" };

export default function PrivacyPage() {
  return (
    <LegalLayout title="隐私政策" lastUpdated="2026-06-29">
      <section>
        <h2 className="text-xl font-black uppercase text-(--neo-cyan) mb-3">引言</h2>
        <p className="text-base font-bold text-(--neo-muted) leading-relaxed">
          欢迎使用 {SITE_BRAND}（{SITE_URL}，以下简称“我们”或“本站”）。
          我们高度重视你的隐私与个人信息的保护。本隐私政策将说明你在使用本站服务时，我们如何收集、使用、存储和保护你的信息。
          我们没有自己的服务器数据库，不会持久化保存任何用户数据；所有创作内容与个人偏好均默认保存在你的本地浏览器中。
          请你仔细阅读本政策，若你继续使用本站服务，即表示你同意本政策的全部内容。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-black uppercase text-(--neo-pink) mb-3">信息收集范围</h2>
        <ul className="space-y-3 text-base font-bold text-(--neo-muted)">
          <li className="flex items-start gap-2">
            <span className="text-(--neo-yellow)">1.</span>
            <span>
              <strong className="text-(--neo-ink)">你输入的内容：</strong>
              你在编辑器中输入的 Markdown 文本、标题、图片链接等创作内容。
              这些数据仅用于实时预览与生成微信公众号排版结果，默认只在你的浏览器本地处理，不会上传到我们或任何第三方的服务器。
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-(--neo-yellow)">2.</span>
            <span>
              <strong className="text-(--neo-ink)">本地偏好设置：</strong>
              我们使用浏览器的 localStorage 保存你的主题偏好、AI 配置、排版参数等设置，
              以便你下次访问时获得一致的体验。这些信息完全存储在你的本地设备上，我们不会读取或收集。
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-(--neo-yellow)">3.</span>
            <span>
              <strong className="text-(--neo-ink)">AI 排版临时数据：</strong>
              当你使用“AI 一键排版”功能时，你输入的内容会临时经过我们的无服务器函数（Serverless
              Function）转发至你配置的第三方 AI 服务提供商（OpenRouter / OpenAI /
              Anthropic）进行处理。
              该过程仅用于完成单次排版请求，我们不会在服务端持久化保存你的文章内容、API Key
              或任何请求记录。
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-(--neo-yellow)">4.</span>
            <span>
              <strong className="text-(--neo-ink)">匿名访问统计：</strong>
              我们使用 Vercel Analytics 收集匿名的页面访问量、设备类型与性能数据，
              用于了解服务使用情况并优化体验。该数据不包含可识别个人身份的信息。
            </span>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-black uppercase text-(--neo-green) mb-3">
          AI 处理与第三方服务
        </h2>
        <p className="text-base font-bold text-(--neo-muted) leading-relaxed mb-4">
          {SITE_BRAND} 的 AI 排版功能依赖以下第三方模型服务提供商：
        </p>
        <ul className="space-y-3 text-base font-bold text-(--neo-muted)">
          <li className="flex items-start gap-2">
            <span className="text-(--neo-yellow)">•</span>
            <span>
              <strong className="text-(--neo-ink)">OpenRouter</strong>（
              <a
                href="https://openrouter.ai/privacy"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-(--neo-ink) hover:text-(--neo-pink) transition-colors underline underline-offset-4 decoration-2"
              >
                隐私政策
              </a>
              ）
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-(--neo-yellow)">•</span>
            <span>
              <strong className="text-(--neo-ink)">OpenAI</strong>（
              <a
                href="https://openai.com/privacy"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-(--neo-ink) hover:text-(--neo-pink) transition-colors underline underline-offset-4 decoration-2"
              >
                隐私政策
              </a>
              ）
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-(--neo-yellow)">•</span>
            <span>
              <strong className="text-(--neo-ink)">Anthropic</strong>（
              <a
                href="https://www.anthropic.com/privacy"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-(--neo-ink) hover:text-(--neo-pink) transition-colors underline underline-offset-4 decoration-2"
              >
                隐私政策
              </a>
              ）
            </span>
          </li>
        </ul>
        <p className="text-base font-bold text-(--neo-muted) leading-relaxed mt-4">
          你自行提供并保存的 API Key 仅存储在你的浏览器 localStorage 中； 在发起 AI 排版请求时，API
          Key 会临时经过我们的无服务器函数用于调用对应服务商的接口，
          请求结束后不会保留在我们的服务或日志中。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-black uppercase text-(--neo-cyan) mb-3">
          localStorage 与 Cookie
        </h2>
        <p className="text-base font-bold text-(--neo-muted) leading-relaxed">
          我们不使用追踪型 Cookie。为了提供主题切换、AI 配置记忆、排版偏好保存等功能，
          我们会将相关数据写入浏览器 localStorage。你可以随时通过浏览器设置清除本站的数据。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-black uppercase text-(--neo-pink) mb-3">数据安全</h2>
        <ul className="space-y-3 text-base font-bold text-(--neo-muted)">
          <li className="flex items-start gap-2">
            <span className="text-(--neo-yellow)">•</span>
            <span>全站使用 HTTPS 加密传输，保护数据在传输过程中的安全。</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-(--neo-yellow)">•</span>
            <span>
              我们不运行持久化数据库，服务端不保留你的文章内容、API Key、排版记录或任何个人数据。
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-(--neo-yellow)">•</span>
            <span>你的 Markdown 内容默认仅在浏览器本地渲染，除非你主动使用 AI 排版功能。</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-(--neo-yellow)">•</span>
            <span>
              我们不会出售、出租或以其他方式向第三方披露你的个人信息，
              除非法律法规要求或经你明确同意。
            </span>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-black uppercase text-(--neo-green) mb-3">无账号体系</h2>
        <p className="text-base font-bold text-(--neo-muted) leading-relaxed">
          {SITE_BRAND} 不注册账号、不收集手机号/邮箱/身份信息，也不保存你的登录状态。
          你随时可以通过清除浏览器数据或更换设备来完全移除与本站相关的所有本地信息。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-black uppercase text-(--neo-cyan) mb-3">用户权利</h2>
        <p className="text-base font-bold text-(--neo-muted) leading-relaxed">
          你可以随时清除浏览器中的 localStorage 以删除本站的本地偏好设置与 AI 配置； 你也可以在 AI
          配置弹窗中更换或删除你的 API Key。
          由于我们不保存你的文章内容，我们无法向你提供内容的删除服务——内容的控制权完全属于你。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-black uppercase text-(--neo-pink) mb-3">儿童隐私</h2>
        <p className="text-base font-bold text-(--neo-muted) leading-relaxed">
          本站的服务不面向 14 周岁以下的儿童。如果你发现儿童向我们提供了个人信息，
          请立即通过本政策末尾的联系方式与我们联系，我们将尽快删除相关信息。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-black uppercase text-(--neo-green) mb-3">政策更新</h2>
        <p className="text-base font-bold text-(--neo-muted) leading-relaxed">
          我们可能会不时修订本隐私政策。修订后的政策将在本页面顶部标注更新日期，
          并在发布时生效。继续使用本站服务即表示你接受修订后的政策。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-black uppercase text-(--neo-cyan) mb-3">联系我们</h2>
        <p className="text-base font-bold text-(--neo-muted) leading-relaxed">
          如果你对本隐私政策有任何疑问，或希望行使你的个人信息权利，请联系：
          <a
            href={`mailto:${SITE_CONTACT_EMAIL}`}
            className="text-(--neo-ink) hover:text-(--neo-pink) transition-colors underline underline-offset-4 decoration-2"
          >
            {SITE_CONTACT_EMAIL}
          </a>
          <br />
          运营主体：{SITE_OPERATOR}
          <br />
          站点域名：{SITE_HOST}
        </p>
      </section>
    </LegalLayout>
  );
}

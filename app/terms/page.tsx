import {
  SITE_BRAND,
  SITE_CONTACT_EMAIL,
  SITE_GITHUB_URL,
  SITE_OPERATOR,
  SITE_URL,
} from "@/lib/site-config";
import { LegalLayout } from "../_components/landing/legal-layout";

export const metadata = { title: "服务条款" };

export default function TermsPage() {
  return (
    <LegalLayout title="服务条款" lastUpdated="2026-06-29">
      <section>
        <h2 className="text-xl font-black uppercase text-(--neo-cyan) mb-3">服务说明</h2>
        <p className="text-base font-bold text-(--neo-muted) leading-relaxed">
          {SITE_BRAND}（{SITE_URL}）提供 Markdown 转微信公众号排版、AI 一键优化排版结构、
          模板套用、实时预览、一键复制、微信公众号同步辅助等在线工具服务（以下简称“本服务”）。
          本服务按“现状”提供，你应自行判断其是否满足你的使用需求。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-black uppercase text-(--neo-pink) mb-3">用户义务</h2>
        <ul className="space-y-3 text-base font-bold text-(--neo-muted)">
          <li className="flex items-start gap-2">
            <span className="text-(--neo-yellow)">•</span>
            <span>
              你不得使用本服务上传、生成、传播任何违反中华人民共和国法律法规、
              侵犯他人知识产权或合法权益、含有恶意代码或病毒的内容。
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-(--neo-yellow)">•</span>
            <span>
              你不得对本服务进行逆向工程、反编译、抓取、批量自动化请求或任何可能影响服务稳定性的行为。
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-(--neo-yellow)">•</span>
            <span>你应对自己输入、生成、发布的内容承担全部法律责任。</span>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-black uppercase text-(--neo-green) mb-3">账户与 API Key</h2>
        <p className="text-base font-bold text-(--neo-muted) leading-relaxed">
          {SITE_BRAND} 不注册账号、不收集身份信息。AI 排版功能需要你自己提供第三方 AI
          服务（OpenRouter / OpenAI / Anthropic）的 API Key。 该 API Key 仅存储在你的浏览器
          localStorage 中；请求时仅临时经过我们的无服务器函数转发至对应服务商，
          我们不会在服务端保存你的 API Key、文章内容或任何请求记录。
          我们不对第三方服务的可用性、准确性、计费或隐私政策负责；
          因你泄露、误用或第三方服务调整导致的损失，由你自行承担。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-black uppercase text-(--neo-cyan) mb-3">知识产权</h2>
        <ul className="space-y-3 text-base font-bold text-(--neo-muted)">
          <li className="flex items-start gap-2">
            <span className="text-(--neo-yellow)">•</span>
            <span>你通过本服务输入、生成的原创内容，其知识产权归你所有。</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-(--neo-yellow)">•</span>
            <span>
              {SITE_BRAND}{" "}
              的品牌标识、界面设计、模板样式、代码及文档受著作权法和其他相关法律法规保护，
              未经授权不得复制、修改、传播或用于商业用途。
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-(--neo-yellow)">•</span>
            <span>
              本项目在 GitHub 开源的部分遵循其对应的开源协议，详见{" "}
              <a
                href={SITE_GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-(--neo-ink) hover:text-(--neo-pink) transition-colors underline underline-offset-4 decoration-2"
              >
                GitHub 仓库
              </a>
              。
            </span>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-black uppercase text-(--neo-pink) mb-3">免责声明</h2>
        <ul className="space-y-3 text-base font-bold text-(--neo-muted)">
          <li className="flex items-start gap-2">
            <span className="text-(--neo-yellow)">•</span>
            <span>
              AI 生成的排版结果仅供参考，你应在发布前自行核对内容的准确性、完整性与合规性。
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-(--neo-yellow)">•</span>
            <span>本服务按“现状”和“可用性”提供，我们不担保服务完全无中断、安全、及时或无误。</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-(--neo-yellow)">•</span>
            <span>
              在适用法律允许的最大范围内，我们不对因使用或无法使用本服务所导致的任何直接、间接、附带或惩罚性损失承担责任。
            </span>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-black uppercase text-(--neo-green) mb-3">服务变更与终止</h2>
        <p className="text-base font-bold text-(--neo-muted) leading-relaxed">
          我们保留随时修改、暂停或终止本服务（或其任何部分）的权利，无需提前通知。
          如你违反本条款，我们有权暂停或终止你使用本服务。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-black uppercase text-(--neo-cyan) mb-3">争议解决</h2>
        <p className="text-base font-bold text-(--neo-muted) leading-relaxed">
          本条款的订立、执行和解释及争议解决均适用中华人民共和国法律。
          如因本条款产生任何争议，双方应首先友好协商解决；协商不成的， 任何一方均可向{" "}
          {SITE_OPERATOR} 所在地有管辖权的人民法院提起诉讼。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-black uppercase text-(--neo-pink) mb-3">联系我们</h2>
        <p className="text-base font-bold text-(--neo-muted) leading-relaxed">
          如对本服务条款有任何疑问，请联系：
          <a
            href={`mailto:${SITE_CONTACT_EMAIL}`}
            className="text-(--neo-ink) hover:text-(--neo-pink) transition-colors underline underline-offset-4 decoration-2"
          >
            {SITE_CONTACT_EMAIL}
          </a>
          <br />
          运营主体：{SITE_OPERATOR}
          <br />
          站点地址：{SITE_URL}
        </p>
      </section>
    </LegalLayout>
  );
}

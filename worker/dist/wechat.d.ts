/**
 * 微信公众号 API 代理 — access_token、图片上传、封面上传、草稿创建。
 * 日志规则：不记录 AppSecret、access_token、文章正文、签名。
 */
import type { WorkerArticle, WorkerResult } from "./types.js";
export declare function createWeChatDraft(appId: string, appSecret: string, article: WorkerArticle): Promise<WorkerResult>;
//# sourceMappingURL=wechat.d.ts.map
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { getAppSecret, accountCount } from "./accounts.js";
import { verifyHmac } from "./hmac.js";
import { createWeChatDraft } from "./wechat.js";
const app = new Hono();
const MAX_BODY_BYTES = 5 * 1024 * 1024; // 5 MB — 文章 HTML + base64 封面图
// ─── 健康检查 ──────────────────────────────────────────────────────────
app.get("/health", (c) => {
    return c.json({ status: "ok" });
});
// ─── 请求体大小限制 ────────────────────────────────────────────────────
app.use("/wechat/draft", async (c, next) => {
    const contentLength = c.req.header("content-length");
    if (contentLength && Number.parseInt(contentLength, 10) > MAX_BODY_BYTES) {
        return c.json({ success: false, error: "请求体过大", details: `上限 ${MAX_BODY_BYTES / 1024 / 1024} MB` }, 413);
    }
    return next();
});
// ─── 草稿创建 ──────────────────────────────────────────────────────────
app.post("/wechat/draft", async (c) => {
    // 1. 读取 raw body（HMAC 需要原始字符串）
    const rawBody = await c.req.text();
    if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES) {
        return c.json({ success: false, error: "请求体过大", details: `上限 ${MAX_BODY_BYTES / 1024 / 1024} MB` }, 413);
    }
    // 2. HMAC 签名验证
    const hmacResult = verifyHmac(c.req.raw.headers, rawBody);
    if (!hmacResult.ok) {
        return c.json({ success: false, error: hmacResult.error, details: hmacResult.details }, hmacResult.status);
    }
    // 3. 解析请求体
    let body;
    try {
        body = JSON.parse(rawBody);
    }
    catch {
        return c.json({ success: false, error: "参数不完整", details: "JSON 解析失败" }, 400);
    }
    const { article, appId } = body;
    // 4. 参数校验
    if (!appId) {
        return c.json({ success: false, error: "参数不完整", details: "缺少 appId" }, 400);
    }
    if (!article || !article.title || !article.html) {
        return c.json({ success: false, error: "参数不完整", details: "缺少 article.title 或 article.html" }, 400);
    }
    // 5. 账号查找
    const appSecret = getAppSecret(appId);
    if (!appSecret) {
        console.error(`[draft] unauthorized appId=${appId}`);
        return c.json({ success: false, error: "未授权的公众号" }, 403);
    }
    // 6. 执行微信 API 调用
    const result = await createWeChatDraft(appId, appSecret, article);
    const status = (result.success ? 200 : mapErrorStatus(result.error));
    return c.json(result, status);
});
function mapErrorStatus(error) {
    switch (error) {
        case "微信授权失败":
            return 401;
        case "未授权的公众号":
            return 403;
        case "参数不完整":
            return 400;
        default:
            return 500;
    }
}
// ─── 全局异常兜底 ──────────────────────────────────────────────────────
app.onError((err, c) => {
    console.error("[worker] uncaught error:", err);
    return c.json({ success: false, error: "Worker 内部错误" }, 500);
});
// ─── 启动 ──────────────────────────────────────────────────────────────
const port = Number.parseInt(process.env.PORT || "3001", 10);
console.log(`TypeZen Sync Worker starting on port ${port}`);
console.log(`WeChat accounts loaded: ${accountCount()}`);
console.log(`HMAC secret configured: ${process.env.SYNC_WORKER_HMAC_SECRET ? "yes" : "NO — requests will be rejected"}`);
serve({ fetch: app.fetch, port }, (info) => {
    console.log(`Worker listening on http://0.0.0.0:${info.port}`);
    console.log(`Health check: GET /health`);
});
//# sourceMappingURL=index.js.map
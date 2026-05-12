import { createHash, createHmac, randomUUID } from "node:crypto";
import type {
  CreateDraftInput,
  CreateDraftResult,
  PlatformCapabilities,
  PublishAdapter,
} from "../types";

const capabilities: PlatformCapabilities = {
  supportsHtml: true,
  supportsMarkdown: false,
  supportsImageUpload: true,
  supportsCoverImage: true,
  supportsDraft: true,
};

function sha256Hex(data: string): string {
  return createHash("sha256").update(data).digest("hex");
}

function hmacSign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

/**
 * 构造 HMAC 签名头。
 * 签名算法：HMAC-SHA256(`${timestamp}\n${nonce}\n${SHA256(body)}`, secret)
 */
function buildHmacHeaders(body: string, secret: string): Record<string, string> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = randomUUID();
  const bodyHash = sha256Hex(body);
  const payload = `${timestamp}\n${nonce}\n${bodyHash}`;
  const signature = hmacSign(payload, secret);

  return {
    "Content-Type": "application/json",
    "X-TypeZen-Timestamp": timestamp,
    "X-TypeZen-Nonce": nonce,
    "X-TypeZen-Signature": signature,
  };
}

async function createDraft(input: CreateDraftInput): Promise<CreateDraftResult> {
  const workerUrl = process.env.SYNC_WORKER_URL;
  const hmacSecret = process.env.SYNC_WORKER_HMAC_SECRET;

  if (!workerUrl) {
    return {
      success: false,
      error: "Sync worker 未配置，请联系管理员",
    };
  }

  if (!hmacSecret) {
    return {
      success: false,
      error: "Sync worker HMAC 密钥未配置",
    };
  }

  // 构造请求体：只发 article + appId，不发 appSecret / licenseKey
  const body = JSON.stringify({
    article: {
      title: input.article.title,
      html: input.article.html,
      digest: input.article.digest,
      author: input.article.author,
      coverImage: input.article.coverImage,
    },
    appId: input.credentials.appId,
  });

  const headers = buildHmacHeaders(body, hmacSecret);

  try {
    const res = await fetch(`${workerUrl}/wechat/draft`, {
      method: "POST",
      headers,
      body,
      signal: AbortSignal.timeout(30_000),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        success: false,
        error: `Sync worker 返回错误 (${res.status})`,
        details: text.slice(0, 200),
      };
    }

    const data = (await res.json()) as CreateDraftResult;
    return data;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      error: "Sync worker 请求失败",
      details: message,
    };
  }
}

export const wechatRemoteAdapter: PublishAdapter = {
  platform: "wechat",
  capabilities,
  createDraft,
};

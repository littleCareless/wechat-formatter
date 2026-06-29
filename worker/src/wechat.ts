/**
 * 微信公众号 API 代理 — access_token、图片上传、封面上传、草稿创建。
 * 日志规则：不记录 AppSecret、access_token、文章正文、签名。
 */

import type { WorkerArticle, WorkerResult } from "./types.js";

const WECHAT_API_BASE = "https://api.weixin.qq.com/cgi-bin";

// ─── access token 缓存 ────────────────────────────────────────────────
// WeChat token 有效期 7200s，提前 300s 刷新
const tokenCache = new Map<string, { token: string; expiresAt: number }>();

async function fetchAccessToken(appId: string, appSecret: string): Promise<string> {
  const cached = tokenCache.get(appId);
  if (cached && cached.expiresAt > Date.now() / 1000) {
    return cached.token;
  }

  const url = `${WECHAT_API_BASE}/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  const data = await res.json();

  if (data.errcode) {
    const errMsg: string = data.errmsg || "";
    if (data.errcode === 40164) {
      const ipMatch = errMsg.match(/invalid ip ([0-9.]+)/);
      const detectedIp = ipMatch ? ipMatch[1] : "";
      const error = detectedIp
        ? `IP白名单错误：请将 IP [${detectedIp}] 加入微信后台白名单`
        : errMsg;
      throw { error, errcode: 40164, detectedIp };
    }
    throw { error: `微信授权失败: ${errMsg} (${data.errcode})`, errcode: data.errcode };
  }

  const token: string = data.access_token;
  tokenCache.set(appId, {
    token,
    expiresAt: Date.now() / 1000 + (data.expires_in as number) - 300,
  });
  return token;
}

// ─── 图片上传 ──────────────────────────────────────────────────────────

async function fetchImageBuffer(src: string): Promise<Buffer | null> {
  try {
    if (src.startsWith("data:image")) {
      const base64 = src.split(",")[1];
      if (!base64) return null;
      return Buffer.from(base64, "base64");
    }
    if (src.startsWith("http")) {
      const res = await fetch(src, {
        signal: AbortSignal.timeout(8_000),
      });
      if (!res.ok) return null;
      const arrayBuf = await res.arrayBuffer();
      return Buffer.from(arrayBuf);
    }
    return null;
  } catch {
    return null;
  }
}

async function uploadImageToWeChat(
  accessToken: string,
  imageBuffer: Buffer,
  filename: string,
): Promise<string> {
  const url = `${WECHAT_API_BASE}/media/uploadimg?access_token=${accessToken}`;
  const formData = new FormData();
  const blob = new Blob([new Uint8Array(imageBuffer)], { type: "image/jpeg" });
  const safeName = filename.match(/\.(jpg|jpeg|png)$/i) ? filename : `${filename}.jpg`;
  formData.append("media", blob, safeName);

  const res = await fetch(url, {
    method: "POST",
    body: formData,
    signal: AbortSignal.timeout(15_000),
  });

  const data = await res.json();
  if (data.errcode) {
    throw new Error(`图片上传失败: ${data.errmsg}`);
  }
  return data.url;
}

async function processHtmlImages(accessToken: string, html: string): Promise<string> {
  const imgRegex = /<img[^>]+src="([^">]+)"/gi;
  let finalHtml = html;
  const matches = Array.from(html.matchAll(imgRegex));
  let remoteCount = 0;

  for (const match of matches) {
    const fullTag = match[0];
    const src = match[1];
    if (!src) continue;

    try {
      const imageBuffer = await fetchImageBuffer(src);
      if (!imageBuffer) continue;

      if (src.startsWith("http")) remoteCount++;

      const filename = src.startsWith("data:image")
        ? `image.${src.match(/data:image\/([^;]+);/)?.[1] || "jpeg"}`
        : src.split("/").pop() || "image.jpg";

      const wechatUrl = await uploadImageToWeChat(accessToken, imageBuffer, filename);

      const newTag = fullTag
        .replace(/src="[^">]+"/i, `src="${wechatUrl}"`)
        .replace(/>$/, ` data-src="${wechatUrl}">`);
      finalHtml = finalHtml.replace(fullTag, newTag);
    } catch {
      // 跳过单张图片失败，不阻塞整体流程
    }
  }

  if (remoteCount > 0) {
    console.log(`image:remote:${remoteCount}`);
  }

  return finalHtml;
}

// ─── 封面上传 ──────────────────────────────────────────────────────────

async function uploadCoverToWeChat(
  accessToken: string,
  imageBuffer: Buffer,
  filename: string,
): Promise<string> {
  const url = `${WECHAT_API_BASE}/material/add_material?access_token=${accessToken}&type=image`;
  const formData = new FormData();
  const blob = new Blob([new Uint8Array(imageBuffer)], { type: "image/jpeg" });
  formData.append("media", blob, filename);

  const res = await fetch(url, {
    method: "POST",
    body: formData,
    signal: AbortSignal.timeout(20_000),
  });

  const data = await res.json();
  if (data.errcode) {
    throw new Error(`封面上传失败: ${data.errmsg}`);
  }
  return data.media_id;
}

// ─── 草稿创建 ──────────────────────────────────────────────────────────

async function addWeChatDraft(
  accessToken: string,
  title: string,
  content: string,
  thumbMediaId: string,
  author: string,
  digest: string,
): Promise<string> {
  const url = `${WECHAT_API_BASE}/draft/add?access_token=${accessToken}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      articles: [
        {
          title,
          author,
          digest,
          content,
          thumb_media_id: thumbMediaId,
          need_open_comment: 0,
          only_fans_can_comment: 0,
        },
      ],
    }),
    signal: AbortSignal.timeout(15_000),
  });

  const data = await res.json();
  if (data.errcode) {
    throw new Error(`新建草稿失败: ${data.errmsg} (${data.errcode})`);
  }
  return data.media_id;
}

// ─── 主流程 ────────────────────────────────────────────────────────────

export async function createWeChatDraft(
  appId: string,
  appSecret: string,
  article: WorkerArticle,
): Promise<WorkerResult> {
  const titlePreview = article.title.slice(0, 30);

  // 1. 获取 access token
  let accessToken: string;
  try {
    accessToken = await fetchAccessToken(appId, appSecret);
  } catch (err: unknown) {
    const e = err as { error?: string; errcode?: number; detectedIp?: string };
    console.error(`[draft] token failed appId=${appId} errcode=${e.errcode ?? "?"}`);
    return {
      success: false,
      error: e.error || "微信授权失败",
      detectedIp: e.detectedIp,
    };
  }

  // 2. 正文图片转存
  let finalHtml: string;
  try {
    finalHtml = await processHtmlImages(accessToken, article.html);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[draft] image process failed appId=${appId} title="${titlePreview}"`);
    return { success: false, error: "内容处理失败", details: message };
  }

  // 3. 封面图
  let thumbMediaId: string;
  try {
    let coverBuffer: Buffer | null = null;
    let coverType = "none";

    if (article.coverImage) {
      coverBuffer = await fetchImageBuffer(article.coverImage);
      coverType = article.coverImage.startsWith("data:") ? "base64" : "url";
    }

    if (!coverBuffer) {
      const imgMatch = article.html.match(/<img[^>]+src="([^">]+)"/i);
      if (imgMatch) {
        coverBuffer = await fetchImageBuffer(imgMatch[1]);
        coverType = imgMatch[1].startsWith("data:") ? "base64" : "url";
      }
    }

    console.log(`cover:${coverType}`);

    if (!coverBuffer) {
      return {
        success: false,
        error: "未能获取到有效的封面图。请确保至少有一张公网可访问的图片或上传本地图片。",
      };
    }

    thumbMediaId = await uploadCoverToWeChat(accessToken, coverBuffer, "cover.jpg");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[draft] cover upload failed appId=${appId}`);
    return { success: false, error: "封面图上传失败", details: message };
  }

  // 4. 摘要
  const digest =
    article.digest ||
    article.html
      .replace(/<[^>]+>/g, "")
      .slice(0, 120)
      .trim();

  // 5. 创建草稿
  try {
    const mediaId = await addWeChatDraft(
      accessToken,
      article.title,
      finalHtml,
      thumbMediaId,
      article.author || "",
      digest,
    );
    console.log(`[draft] success appId=${appId} title="${titlePreview}" mediaId=${mediaId}`);
    return { success: true, externalDraftId: mediaId };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[draft] create failed appId=${appId} title="${titlePreview}"`);
    return { success: false, error: "新建草稿失败", details: message };
  }
}

import axios from "axios";
import {
  addWeChatDraft,
  getWeChatAccessToken,
  processHtmlImages,
  uploadCoverToWeChat,
  WeChatApiError,
} from "../../../api/wechat/utils";
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

async function fetchImageBuffer(url: string): Promise<Buffer | null> {
  try {
    if (url.startsWith("data:image")) {
      return Buffer.from(url.split(",")[1], "base64");
    }
    if (url.startsWith("http")) {
      const res = await axios.get(url, {
        responseType: "arraybuffer",
        timeout: 5000,
      });
      return Buffer.from(res.data);
    }
    return null;
  } catch (e) {
    const source = url.startsWith("data:image")
      ? "base64"
      : url.startsWith("http")
        ? "remote"
        : "unknown";
    console.error(`Failed to fetch image (source: ${source}):`, e instanceof Error ? e.message : e);
    return null;
  }
}

async function createDraft(input: CreateDraftInput): Promise<CreateDraftResult> {
  const { article, credentials } = input;
  const { appId, appSecret, author } = credentials;

  if (!appId || !appSecret) {
    return { success: false, error: "缺少 AppID 或 AppSecret" };
  }

  // 1. 获取 Access Token
  let accessToken: string;
  try {
    accessToken = await getWeChatAccessToken(appId, appSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const detectedIp = err instanceof WeChatApiError ? err.detectedIp : "";
    return {
      success: false,
      error: "微信授权失败",
      details: message,
      detectedIp,
    };
  }

  // 2. 图片转存与 HTML 替换
  let finalHtml: string;
  try {
    finalHtml = await processHtmlImages(accessToken, article.html);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: "内容处理失败", details: message };
  }

  // 3. 处理封面图
  let thumbMediaId: string;
  try {
    let coverBuffer: Buffer | null = null;

    if (article.coverImage) {
      coverBuffer = await fetchImageBuffer(article.coverImage);
    }

    if (!coverBuffer) {
      const imgMatch = article.html.match(/<img[^>]+src="([^">]+)"/i);
      if (imgMatch) {
        coverBuffer = await fetchImageBuffer(imgMatch[1]);
      }
    }

    if (!coverBuffer) {
      return {
        success: false,
        error: "未能获取到有效的封面图。请确保至少有一张公网可访问的图片或上传本地图片。",
      };
    }

    thumbMediaId = await uploadCoverToWeChat(accessToken, coverBuffer, "cover.jpg");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: "封面图上传失败", details: message };
  }

  // 4. 生成摘要
  const safeMarkdown = article.markdown || "";
  const digest =
    article.digest ||
    safeMarkdown
      .slice(0, 120)
      .replace(/#|\*|`|>|\[|\]|\(|\)/g, "")
      .trim();

  // 5. 新建草稿
  try {
    const mediaId = await addWeChatDraft(
      accessToken,
      article.title,
      finalHtml,
      thumbMediaId,
      author || article.author || "",
      digest,
    );

    return { success: true, externalDraftId: mediaId };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: "新建草稿失败", details: message };
  }
}

export const wechatAdapter: PublishAdapter = {
  platform: "wechat",
  capabilities,
  createDraft,
};

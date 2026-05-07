import { type NextRequest, NextResponse } from "next/server";
import { 
  getWeChatAccessToken, 
  processHtmlImages, 
  uploadCoverToWeChat, 
  addWeChatDraft 
} from "../utils";
import axios from "axios";
import type { WeChatSyncRequest } from "../../../_types/wechat";

export const runtime = "nodejs"; // 必须使用 nodejs runtime 以支持 sharp 和 jsdom

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as WeChatSyncRequest;
    const { html, title, config, coverImage, markdown } = body;

    if (!html || !title || !config.appId || !config.appSecret) {
      return NextResponse.json(
        { success: false, error: "参数不完整，请检查配置" },
        { status: 400 }
      );
    }

    // 1. 获取 Access Token
    let accessToken: string;
    try {
      accessToken = await getWeChatAccessToken(config.appId, config.appSecret);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      const detectedIp = (err as any)?.detectedIp || "";
      console.error("微信授权失败详情:", message);
      return NextResponse.json(
        { 
          success: false, 
          error: "微信授权失败", 
          details: message,
          detectedIp: detectedIp // 将检测到的精准 IP 返回
        },
        { status: 401 }
      );
    }

    // 2. 图片转存与 HTML 替换
    let finalHtml: string;
    try {
      finalHtml = await processHtmlImages(accessToken, html);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return NextResponse.json(
        { success: false, error: "图片转存失败", details: message },
        { status: 500 }
      );
    }

    // 3. 处理封面图
    let thumbMediaId = "";
    try {
      let coverBuffer: Buffer;
      const filename = "cover.jpg";

      if (coverImage) {
        if (coverImage.startsWith("data:image")) {
          coverBuffer = Buffer.from(coverImage.split(",")[1], "base64");
        } else {
          const res = await axios.get(coverImage, { responseType: "arraybuffer" });
          coverBuffer = Buffer.from(res.data);
        }
      } else {
        // 如果没传封面图，尝试从 HTML 中提取第一张
        const imgMatch = html.match(/<img[^>]+src="([^">]+)"/i);
        if (imgMatch) {
          const firstImgSrc = imgMatch[1];
          if (firstImgSrc.startsWith("data:image")) {
            coverBuffer = Buffer.from(firstImgSrc.split(",")[1], "base64");
          } else {
            const res = await axios.get(firstImgSrc, { responseType: "arraybuffer" });
            coverBuffer = Buffer.from(res.data);
          }
        } else {
          // 如果全文无图，抛错（微信草稿强制需要封面）
          throw new Error("未找到封面图，且文章正文中也没有图片。请至少上传一张图片。");
        }
      }

      thumbMediaId = await uploadCoverToWeChat(accessToken, coverBuffer, filename);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return NextResponse.json(
        { success: false, error: "封面图处理失败", details: message },
        { status: 500 }
      );
    }

    // 4. 生成摘要 (如果不提供则抓取正文)
    const digest = markdown.slice(0, 120).replace(/#|\*|`|>|\[|\]|\(|\)/g, "").trim();

    // 5. 新建草稿
    const mediaId = await addWeChatDraft(
      accessToken,
      title,
      finalHtml,
      thumbMediaId,
      config.author,
      digest
    );

    return NextResponse.json({
      success: true,
      mediaId
    });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("WeChat sync error:", err);
    return NextResponse.json(
      { success: false, error: "服务器内部错误", details: message },
      { status: 500 }
    );
  }
}

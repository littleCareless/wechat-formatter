import { type NextRequest, NextResponse } from "next/server";
import { verifyLicense } from "../../../_lib/license";
import { getWeChatAdapter } from "../../../_lib/publishing/adapters";
import type { CanonicalArticle, WeChatCredentials } from "../../../_lib/publishing/types";
import type { WeChatSyncRequest } from "../../../_types/wechat";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // 0. License 校验（header，先于 body 解析）
  const licenseKey = req.headers.get("x-typezen-license") || "";
  const licenseResult = verifyLicense(licenseKey);
  if (!licenseResult.valid) {
    return NextResponse.json(
      { success: false, error: licenseResult.error || "License 无效" },
      { status: 403 },
    );
  }

  try {
    const body = (await req.json()) as WeChatSyncRequest;
    const { html, title, config, coverImage, markdown } = body;

    if (!html || !title || !config.appId || !config.appSecret) {
      return NextResponse.json(
        { success: false, error: "参数不完整，请检查配置" },
        { status: 400 },
      );
    }

    const article: CanonicalArticle = {
      title,
      html,
      markdown: markdown || "",
      author: config.author,
      coverImage,
    };

    const adapter = getWeChatAdapter();
    const isRemote = !!process.env.SYNC_WORKER_URL;
    const credentials: WeChatCredentials = {
      appId: config.appId,
      author: config.author,
      // 只有本地 adapter 需要 appSecret；remote adapter 由 worker 自行持有
      ...(isRemote ? {} : { appSecret: config.appSecret }),
    };
    const result = await adapter.createDraft({ article, credentials });

    if (!result.success) {
      const status = result.error === "微信授权失败" ? 401 : 500;
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          details: result.details,
          detectedIp: result.detectedIp,
        },
        { status },
      );
    }

    return NextResponse.json({
      success: true,
      mediaId: result.externalDraftId,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("WeChat sync error:", message);
    return NextResponse.json(
      { success: false, error: "服务器异常", details: message },
      { status: 500 },
    );
  }
}

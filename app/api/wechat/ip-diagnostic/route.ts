import { type NextRequest, NextResponse } from "next/server";
import type { WeChatIpDiagnosticRequest, WeChatIpDiagnosticResponse } from "../../../_types/wechat";
import { WeChatApiError, getWeChatAccessToken } from "../utils";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: WeChatIpDiagnosticRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        status: "error",
        message: "请求格式错误",
      } satisfies WeChatIpDiagnosticResponse,
      { status: 400 },
    );
  }

  const { config } = body;
  if (!config?.appId || !config?.appSecret) {
    return NextResponse.json(
      {
        success: false,
        status: "error",
        message: "缺少 AppID 或 AppSecret",
      } satisfies WeChatIpDiagnosticResponse,
      { status: 400 },
    );
  }

  // 远程 Worker 模式：Next.js 本地出口 IP 无意义
  if (process.env.SYNC_WORKER_URL) {
    return NextResponse.json({
      success: true,
      status: "remote_worker_mode",
      message:
        "当前为远程 Worker 模式，Next.js 自身出口 IP 不代表实际同步出口。请以 Worker 出口 IP 或 Worker 诊断结果为准。",
    } satisfies WeChatIpDiagnosticResponse);
  }

  // 本地 adapter 模式：调用微信 token 接口探测
  try {
    await getWeChatAccessToken(config.appId, config.appSecret);
    return NextResponse.json({
      success: true,
      status: "authorized",
      message: "当前出口已通过微信授权校验。如仅配置白名单，无需新增 IP。",
    } satisfies WeChatIpDiagnosticResponse);
  } catch (err: unknown) {
    if (err instanceof WeChatApiError) {
      if (err.errcode === 40164) {
        return NextResponse.json({
          success: true,
          status: "invalid_ip",
          message: "微信识别到的出口 IP 未在白名单中，请将下方 IP 加入微信后台。",
          errcode: 40164,
          detectedIp: err.detectedIp || undefined,
        } satisfies WeChatIpDiagnosticResponse);
      }

      if (
        err.errcode === 40001 ||
        err.errcode === 40125 ||
        err.errcode === 40013 ||
        err.errcode === 40163
      ) {
        return NextResponse.json({
          success: false,
          status: "invalid_credentials",
          message: "AppID 或 AppSecret 错误，请检查后重试。",
          errcode: err.errcode,
          details: err.rawMessage,
        } satisfies WeChatIpDiagnosticResponse);
      }

      return NextResponse.json({
        success: false,
        status: "wechat_error",
        message: `微信接口返回错误 (${err.errcode})`,
        errcode: err.errcode,
        details: err.rawMessage,
      } satisfies WeChatIpDiagnosticResponse);
    }

    const message = err instanceof Error ? err.message : "未知错误";
    console.error("IP diagnostic error:", message);
    return NextResponse.json(
      {
        success: false,
        status: "error",
        message: "诊断请求失败，请稍后重试",
        details: message,
      } satisfies WeChatIpDiagnosticResponse,
      { status: 500 },
    );
  }
}

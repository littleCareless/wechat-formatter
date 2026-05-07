import { type NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    /**
     * 精准获取出口 IP 的逻辑：
     * 1. 在 Vercel/Cloudflare 等平台，x-forwarded-for 头部包含了最真实的请求来源 IP。
     * 2. req.ip 是 Next.js 自动从底层网关提取的 IP。
     * 3. 对于本地开发，如果配置了代理，我们将结合多方信息。
     */
    const forwarded = req.headers.get("x-forwarded-for");
    let ip = "";
    
    if (forwarded) {
      // 可能会有多个 IP（经过多层代理），取第一个
      ip = forwarded.split(",")[0].trim();
    } else {
      ip = req.ip || "127.0.0.1";
    }

    // 处理 IPv6 映射的 IPv4 情况 (如 ::ffff:1.2.3.4)
    if (ip.startsWith("::ffff:")) {
      ip = ip.substring(7);
    }

    return NextResponse.json({ ip });
  } catch (_err) {
    return NextResponse.json({ ip: "无法探测 IP" });
  }
}

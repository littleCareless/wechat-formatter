import { type NextRequest, NextResponse } from "next/server";
import dns from 'node:dns/promises';

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    /**
     * 采用“DNS 穿透探测 + 代理头兜底”的综合策略：
     * 1. 优先使用 DNS TXT 记录查询。这走的是 UDP 53 端口，通常能绕过 Clash 等 
     *    HTTP 代理，直接拿到运营商分配的真实出口 IP。
     * 2. 如果 DNS 失败，再从请求头（Vercel/Cloudflare）读取。
     */
    let detectedIp = "";

    try {
      // 查询 Google 的特殊 TXT 记录，它会返回请求者的公网出口 IP
      // 设置较短的超时时间，避免挂起
      const records = await dns.resolveTxt('o-o.myaddr.l.google.com');
      if (records && records[0] && records[0][0]) {
        detectedIp = records[0][0];
      }
    } catch (dnsErr) {
      console.warn("DNS IP Detection failed, falling back to headers:", dnsErr);
    }

    // 如果 DNS 没拿到，尝试从请求头读取（线上环境有效）
    if (!detectedIp) {
      const forwarded = req.headers.get("x-forwarded-for");
      const realIp = req.headers.get("x-real-ip");
      if (forwarded) {
        detectedIp = forwarded.split(",")[0].trim();
      } else if (realIp) {
        detectedIp = realIp;
      } else {
        detectedIp = (req as any).ip || "";
      }
    }

    // 清理 IPv6 映射
    if (detectedIp.startsWith("::ffff:")) {
      detectedIp = detectedIp.substring(7);
    }

    // 最终返回结果
    if (!detectedIp || detectedIp === "127.0.0.1" || detectedIp === "localhost") {
      return NextResponse.json({ 
        ip: "请点击下方探测按钮捕获真值",
        isManualRequired: true 
      });
    }

    return NextResponse.json({ 
      ip: detectedIp,
      isManualRequired: false 
    });
  } catch (_err) {
    return NextResponse.json({ ip: "请点击同步按钮自动捕获" });
  }
}
}

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
const TIMESTAMP_TOLERANCE = 300; // ±5 分钟
const NONCE_TTL = 600; // nonce 保留 10 分钟
// nonce → 过期时间戳（秒）
const nonceStore = new Map();
// 每 60 秒清理过期 nonce
setInterval(() => {
    const now = Math.floor(Date.now() / 1000);
    for (const [nonce, expiry] of nonceStore) {
        if (expiry <= now)
            nonceStore.delete(nonce);
    }
}, 60_000);
function sha256Hex(data) {
    return createHash("sha256").update(data).digest("hex");
}
function hmacSign(payload, secret) {
    return createHmac("sha256", secret).update(payload).digest("hex");
}
function constantTimeEqual(a, b) {
    if (a.length !== b.length)
        return false;
    return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}
/**
 * 校验 HMAC 签名。
 * 签名算法：HMAC-SHA256(`${timestamp}\n${nonce}\n${SHA256(body)}`, secret)
 */
export function verifyHmac(headers, rawBody) {
    const secret = process.env.SYNC_WORKER_HMAC_SECRET;
    if (!secret) {
        return { ok: false, error: "Worker 内部错误", details: "HMAC secret not configured", status: 500 };
    }
    const timestamp = headers.get("x-typezen-timestamp");
    const nonce = headers.get("x-typezen-nonce");
    const signature = headers.get("x-typezen-signature");
    if (!timestamp || !nonce || !signature) {
        return { ok: false, error: "签名验证失败", details: "缺少签名头", status: 401 };
    }
    // 1. 时间窗口检查
    const now = Math.floor(Date.now() / 1000);
    const ts = Number.parseInt(timestamp, 10);
    if (Number.isNaN(ts) || Math.abs(now - ts) > TIMESTAMP_TOLERANCE) {
        return { ok: false, error: "签名验证失败", details: "时间戳过期", status: 401 };
    }
    // 2. Nonce 去重
    if (nonceStore.has(nonce)) {
        return { ok: false, error: "签名验证失败", details: "重复请求", status: 401 };
    }
    // 3. 验签
    const bodyHash = sha256Hex(rawBody);
    const expectedPayload = `${timestamp}\n${nonce}\n${bodyHash}`;
    const expectedSig = hmacSign(expectedPayload, secret);
    if (!constantTimeEqual(expectedSig, signature)) {
        return { ok: false, error: "签名验证失败", details: "签名不匹配", status: 401 };
    }
    // 4. 记录 nonce（签名验证通过后才记录）
    nonceStore.set(nonce, now + NONCE_TTL);
    return { ok: true };
}
//# sourceMappingURL=hmac.js.map
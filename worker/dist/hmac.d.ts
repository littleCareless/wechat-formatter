export type HmacVerifyResult = {
    ok: true;
} | {
    ok: false;
    error: string;
    details: string;
    status: 401 | 500;
};
/**
 * 校验 HMAC 签名。
 * 签名算法：HMAC-SHA256(`${timestamp}\n${nonce}\n${SHA256(body)}`, secret)
 */
export declare function verifyHmac(headers: Headers, rawBody: string): HmacVerifyResult;
//# sourceMappingURL=hmac.d.ts.map
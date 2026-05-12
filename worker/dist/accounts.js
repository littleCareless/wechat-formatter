/**
 * 从环境变量加载微信公众号账号配置。
 * 优先级：WECHAT_ACCOUNTS > WECHAT_DEFAULT_APPID + WECHAT_DEFAULT_APPSECRET
 */
let accountsCache = null;
function loadAccounts() {
    if (accountsCache)
        return accountsCache;
    const map = new Map();
    // 多账号格式：wx123:secret1,wx456:secret2
    const multi = process.env.WECHAT_ACCOUNTS;
    if (multi) {
        for (const pair of multi.split(",")) {
            const [appId, appSecret] = pair.split(":");
            if (appId && appSecret) {
                map.set(appId.trim(), appSecret.trim());
            }
        }
    }
    // 单账号默认值
    const defaultAppId = process.env.WECHAT_DEFAULT_APPID;
    const defaultSecret = process.env.WECHAT_DEFAULT_APPSECRET;
    if (defaultAppId && defaultSecret && !map.has(defaultAppId)) {
        map.set(defaultAppId, defaultSecret);
    }
    accountsCache = map;
    return map;
}
export function getAppSecret(appId) {
    return loadAccounts().get(appId);
}
export function hasAccounts() {
    return loadAccounts().size > 0;
}
/** 仅用于启动日志，不暴露 secret */
export function accountCount() {
    return loadAccounts().size;
}
//# sourceMappingURL=accounts.js.map
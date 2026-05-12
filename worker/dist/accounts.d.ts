/**
 * 从环境变量加载微信公众号账号配置。
 * 优先级：WECHAT_ACCOUNTS > WECHAT_DEFAULT_APPID + WECHAT_DEFAULT_APPSECRET
 */
export declare function getAppSecret(appId: string): string | undefined;
export declare function hasAccounts(): boolean;
/** 仅用于启动日志，不暴露 secret */
export declare function accountCount(): number;
//# sourceMappingURL=accounts.d.ts.map
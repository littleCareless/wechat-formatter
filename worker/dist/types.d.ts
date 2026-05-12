/** 文章结构 — 与 Next.js 侧 CanonicalArticle 对齐，但不含 markdown */
export type WorkerArticle = {
    title: string;
    html: string;
    digest?: string;
    author?: string;
    coverImage?: string;
};
export type DraftRequest = {
    article: WorkerArticle;
    appId: string;
};
export type WorkerResult = {
    success: boolean;
    externalDraftId?: string;
    error?: string;
    details?: string;
    detectedIp?: string;
};
//# sourceMappingURL=types.d.ts.map
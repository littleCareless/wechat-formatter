/** 平台无关的文章结构 */
export type CanonicalArticle = {
  title: string;
  html: string;
  markdown: string;
  digest?: string;
  author?: string;
  coverImage?: string; // Base64 或 URL
};

export type PublishPlatform = "wechat";

export type PlatformCapabilities = {
  supportsHtml: boolean;
  supportsMarkdown: boolean;
  supportsImageUpload: boolean;
  supportsCoverImage: boolean;
  supportsDraft: boolean;
};

export type WeChatCredentials = {
  appId: string;
  appSecret?: string; // 本地 adapter 必需；remote adapter 不使用
  author?: string;
};

export type CreateDraftInput = {
  article: CanonicalArticle;
  credentials: WeChatCredentials;
};

export type CreateDraftResult = {
  success: boolean;
  externalDraftId?: string;
  error?: string;
  details?: string;
  detectedIp?: string;
};

export type PublishAdapter = {
  readonly platform: PublishPlatform;
  readonly capabilities: PlatformCapabilities;
  createDraft(input: CreateDraftInput): Promise<CreateDraftResult>;
};

export type WeChatAccountConfig = {
  appId: string;
  appSecret: string;
  author: string;
};

export type WeChatSyncStatus = "idle" | "authorizing" | "uploading_images" | "creating_draft" | "success" | "error";

export type WeChatSyncRequest = {
  html: string;
  markdown: string;
  title: string;
  config: WeChatAccountConfig;
  coverImage?: string; // Base64 or URL
};

export type WeChatSyncResponse = {
  success: boolean;
  mediaId?: string;
  error?: string;
  details?: string;
};

export type WeChatAccountConfig = {
  appId: string;
  appSecret: string;
  author: string;
};

export type WeChatSyncStatus =
  | "idle"
  | "authorizing"
  | "uploading_images"
  | "creating_draft"
  | "success"
  | "error";

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
  detectedIp?: string;
};

// --- IP Diagnostic types ---

export type WeChatIpDiagnosticStatus = "idle" | "checking" | "captured" | "authorized" | "error";

export type WeChatIpDiagnosticRequest = {
  config: {
    appId: string;
    appSecret: string;
  };
};

export type WeChatIpDiagnosticResponse = {
  success: boolean;
  status:
    | "authorized"
    | "invalid_ip"
    | "invalid_credentials"
    | "wechat_error"
    | "remote_worker_mode"
    | "error";
  message: string;
  errcode?: number;
  details?: string;
  detectedIp?: string;
};

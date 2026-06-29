import type { PublishAdapter } from "../types";
import { wechatAdapter } from "./wechat";
import { wechatRemoteAdapter } from "./wechat-remote";

export function getWeChatAdapter(): PublishAdapter {
  if (process.env.SYNC_WORKER_URL) {
    return wechatRemoteAdapter;
  }
  return wechatAdapter;
}

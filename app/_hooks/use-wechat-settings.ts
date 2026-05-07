import { useState, useEffect } from "react";
import type { WeChatAccountConfig } from "../_types/wechat";

const WECHAT_CONFIG_KEY = "typezen_wechat_config";

const DEFAULT_CONFIG: WeChatAccountConfig = {
  appId: "",
  appSecret: "",
  author: ""
};

export function useWeChatSettings() {
  const [wechatConfig, setWechatConfig] = useState<WeChatAccountConfig>(DEFAULT_CONFIG);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(WECHAT_CONFIG_KEY);
    if (saved) {
      try {
        setWechatConfig(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse WeChat config", e);
      }
    }
  }, []);

  const updateConfig = (newConfig: Partial<WeChatAccountConfig>) => {
    const updated = { ...wechatConfig, ...newConfig };
    setWechatConfig(updated);
    localStorage.setItem(WECHAT_CONFIG_KEY, JSON.stringify(updated));
  };

  return {
    wechatConfig,
    updateConfig,
    isConfigModalOpen,
    setIsConfigModalOpen
  };
}

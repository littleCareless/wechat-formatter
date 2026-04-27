import { useCallback, useState } from "react";
import type { AiProviderType } from "../_types/formatter";
import type { ShowToast } from "./use-toast";

type UseAiFormatParams = {
  inputText: string;
  setInputText: (value: string) => void;
  aiProviderType: AiProviderType;
  aiBaseUrl: string;
  aiApiKey: string;
  aiModel: string;
  setShowAiConfigModal: (value: boolean) => void;
  showToast: ShowToast;
};

export function useAiFormat({
  inputText,
  setInputText,
  aiProviderType,
  aiBaseUrl,
  aiApiKey,
  aiModel,
  setShowAiConfigModal,
  showToast,
}: UseAiFormatParams) {
  const [isAiFormatting, setIsAiFormatting] = useState(false);

  const handleAiFormat = useCallback(async () => {
    if (!inputText.trim() || isAiFormatting) return;

    const trimmedBaseUrl = aiBaseUrl.trim();
    const trimmedApiKey = aiApiKey.trim();
    const trimmedModel = aiModel.trim();
    if (!trimmedBaseUrl || !trimmedApiKey || !trimmedModel) {
      setShowAiConfigModal(true);
      showToast("请先配置 AI 服务地址、API Key 和模型", "error");
      return;
    }

    setIsAiFormatting(true);
    try {
      const res = await fetch("/api/ai-format", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          markdown: inputText,
          providerType: aiProviderType,
          baseUrl: trimmedBaseUrl,
          apiKey: trimmedApiKey,
          model: trimmedModel,
        }),
      });

      const data = (await res.json()) as {
        markdown?: string;
        error?: string;
      };

      if (!res.ok) {
        showToast(data.error || "AI 排版失败，请重试", "error");
        return;
      }

      if (data.markdown) {
        setInputText(data.markdown);
        showToast("AI 排版完成");
      }
    } catch {
      showToast("网络错误，请稍后重试", "error");
    } finally {
      setIsAiFormatting(false);
    }
  }, [
    inputText,
    isAiFormatting,
    aiProviderType,
    aiBaseUrl,
    aiApiKey,
    aiModel,
    setInputText,
    setShowAiConfigModal,
    showToast,
  ]);

  return { isAiFormatting, handleAiFormat };
}

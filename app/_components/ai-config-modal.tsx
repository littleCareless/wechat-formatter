import { Anthropic, OpenAI } from "@lobehub/icons";
import type React from "react";
import type { AiProviderType } from "../_types/formatter";

type AiConfigModalProps = {
  open: boolean;
  aiProviderType: AiProviderType;
  setAiProviderType: React.Dispatch<React.SetStateAction<AiProviderType>>;
  aiBaseUrl: string;
  setAiBaseUrl: React.Dispatch<React.SetStateAction<string>>;
  aiApiKey: string;
  setAiApiKey: React.Dispatch<React.SetStateAction<string>>;
  aiModel: string;
  setAiModel: React.Dispatch<React.SetStateAction<string>>;
  onClose: () => void;
  onSave: () => void;
  onClear: () => void;
};

export function AiConfigModal({
  open,
  aiProviderType,
  setAiProviderType,
  aiBaseUrl,
  setAiBaseUrl,
  aiApiKey,
  setAiApiKey,
  aiModel,
  setAiModel,
  onClose,
  onSave,
  onClear,
}: AiConfigModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-5">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">AI 服务配置</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            支持 OpenAI 接口和 Anthropic 原生接口
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              API 类型
            </label>
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-gray-100 dark:bg-gray-700 p-1">
              <button
                type="button"
                onClick={() => setAiProviderType("openai")}
                className={`py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  aiProviderType === "openai"
                    ? "bg-white dark:bg-gray-600 text-violet-600 dark:text-violet-300 shadow-sm"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                <OpenAI size={16} />
                OpenAI
              </button>
              <button
                type="button"
                onClick={() => setAiProviderType("anthropic")}
                className={`py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  aiProviderType === "anthropic"
                    ? "bg-white dark:bg-gray-600 text-violet-600 dark:text-violet-300 shadow-sm"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                <Anthropic size={16} />
                Anthropic
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              API 地址
            </label>
            <input
              type="text"
              value={aiBaseUrl}
              onChange={(e) => setAiBaseUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder={
                aiProviderType === "anthropic"
                  ? "https://api.anthropic.com/v1"
                  : "https://api.openai.com/v1"
              }
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              API Key
            </label>
            <input
              type="password"
              value={aiApiKey}
              onChange={(e) => setAiApiKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="粘贴你的 API Key"
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              模型名称
            </label>
            <input
              type="text"
              value={aiModel}
              onChange={(e) => setAiModel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder={aiProviderType === "anthropic" ? "claude-sonnet-4-5" : "gpt-4o"}
              autoComplete="off"
            />
          </div>

          <p className="text-xs leading-relaxed text-gray-400 dark:text-gray-500">
            配置只保存在当前浏览器本地，排版时会临时发送到服务端调用你填写的模型服务。
          </p>
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={onSave}
            className="flex-1 py-2.5 bg-violet-500 hover:bg-violet-600 text-white rounded-xl font-medium transition-colors"
          >
            保存配置
          </button>
          <button
            onClick={onClear}
            className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-xl font-medium transition-colors"
          >
            清空
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-xl font-medium transition-colors"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}

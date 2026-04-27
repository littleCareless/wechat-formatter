export type ActiveTab = "input" | "preview" | "settings";

export type AiProviderType = "openai" | "anthropic";

export type ToastType = "success" | "error";

export type ToastState = {
  message: string;
  type: ToastType;
} | null;

export type WordCount = {
  chars: number;
  words: number;
  lines: number;
  readTime: number;
};

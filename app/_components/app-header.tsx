import { CircleDollarSign, Copy, Moon, Sun } from "lucide-react";
import type React from "react";
import type { ActiveTab } from "../_types/formatter";

type AppHeaderProps = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onShowReward: () => void;
  onCopy: () => void;
  hasContent: boolean;
  activeTab: ActiveTab;
  setActiveTab: React.Dispatch<React.SetStateAction<ActiveTab>>;
};

export function AppHeader({
  isDarkMode,
  toggleDarkMode,
  onShowReward,
  onCopy,
  hasContent,
  activeTab,
  setActiveTab,
}: AppHeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-20">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-9 h-9 object-cover rounded-xl shadow-sm border border-gray-100 dark:border-gray-600"
          />
          <h1 className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300">
            公众号排版助手
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            className="text-gray-500 dark:text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-gray-700 p-2 rounded-full transition-all"
            title={isDarkMode ? "切换到亮色模式" : "切换到暗黑模式"}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={onShowReward}
            className="text-gray-500 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-gray-700 p-2 rounded-full transition-all"
            title="赞赏支持"
          >
            <CircleDollarSign className="w-5 h-5" />
          </button>
          <button
            onClick={onCopy}
            className="bg-[#07c160] hover:bg-[#06ad56] text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-full font-bold shadow-md shadow-green-500/20 transition-all flex items-center gap-2 text-sm sm:text-base active:scale-95 disabled:opacity-50"
            disabled={!hasContent}
          >
            <Copy className="w-5 h-5 hidden sm:block" />
            一键复制发布
          </button>
        </div>
      </div>

      <div className="flex bg-gray-50 dark:bg-gray-700 border-t border-gray-100 dark:border-gray-700 p-2 md:hidden">
        <button
          onClick={() => setActiveTab("input")}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${activeTab === "input" ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400" : "text-gray-500 dark:text-gray-400"}`}
        >
          编辑
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${activeTab === "preview" ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400" : "text-gray-500 dark:text-gray-400"}`}
        >
          预览
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${activeTab === "settings" ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400" : "text-gray-500 dark:text-gray-400"}`}
        >
          样式 & 模板
        </button>
      </div>
    </header>
  );
}

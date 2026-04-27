import { ArrowLeftRight, Check, SlidersHorizontal, Sparkles } from "lucide-react";
import type React from "react";
import type { ActiveTab } from "../_types/formatter";
import type { TemplateConfig } from "../template-engine";

type TemplateGroup = {
  id: string;
  name: string;
  templates: TemplateConfig[];
};

type SettingsPaneProps = {
  activeTab: ActiveTab;
  allTemplatesCount: number;
  groupedTemplates: TemplateGroup[];
  currentCategory: string;
  setCurrentCategory: React.Dispatch<React.SetStateAction<string>>;
  currentTemplateId: string;
  setCurrentTemplateId: React.Dispatch<React.SetStateAction<string>>;
  fontSize: number;
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
  lineHeight: number;
  setLineHeight: React.Dispatch<React.SetStateAction<number>>;
  syncScroll: boolean;
  setSyncScroll: React.Dispatch<React.SetStateAction<boolean>>;
};

export function SettingsPane({
  activeTab,
  allTemplatesCount,
  groupedTemplates,
  currentCategory,
  setCurrentCategory,
  currentTemplateId,
  setCurrentTemplateId,
  fontSize,
  setFontSize,
  lineHeight,
  setLineHeight,
  syncScroll,
  setSyncScroll,
}: SettingsPaneProps) {
  return (
    <div
      className={`w-full md:w-64 lg:w-[320px] flex-col gap-4 shrink-0 h-full overflow-y-auto pb-24 md:pb-0 custom-scrollbar ${activeTab === "settings" ? "flex" : "hidden md:flex"}`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col max-h-[60vh] md:max-h-full">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 shrink-0">
          <h2 className="text-[15px] font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-500" />
            主题模板 ({allTemplatesCount}款)
          </h2>
        </div>

        <div className="flex overflow-x-auto bg-gray-50 dark:bg-gray-700 px-2 py-1.5 shrink-0 scrollbar-hide">
          {groupedTemplates.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCurrentCategory(cat.id)}
              className={`whitespace-nowrap px-3 py-1.5 text-xs font-medium rounded-full transition-all ${currentCategory === cat.id ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="p-3 overflow-y-auto flex-1 grid grid-cols-3 2xl:grid-cols-4 gap-2 content-start bg-gray-50/50 dark:bg-gray-900/50 custom-scrollbar">
          {groupedTemplates
            .find((group) => group.id === currentCategory)
            ?.templates.map((template) => (
              <button
                key={template.id}
                onClick={() => setCurrentTemplateId(template.id)}
                className={`relative p-2 rounded-xl border text-center transition-all duration-200 flex flex-col gap-1 items-center justify-center bg-white dark:bg-gray-700 ${
                  currentTemplateId === template.id
                    ? "border-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,0.3)]"
                    : "border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 shadow-sm"
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 w-full">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: template.themeColor }}
                  />
                  <span className="font-bold text-xs text-gray-800 dark:text-gray-200 truncate">
                    {template.name}
                  </span>
                </div>

                {currentTemplateId === template.id && (
                  <div className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white rounded-full p-0.5 shadow-md">
                    <Check className="w-2.5 h-2.5" strokeWidth={3} />
                  </div>
                )}
              </button>
            ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 shrink-0">
        <h2 className="text-[14px] font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-blue-500" />
          细节微调
        </h2>
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
              <span>正文字号</span>
              <span className="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-1.5 rounded">
                {fontSize}px
              </span>
            </div>
            <input
              type="range"
              min="14"
              max="20"
              step="1"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full h-1 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
              <span>行高间距</span>
              <span className="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-1.5 rounded">
                {lineHeight}
              </span>
            </div>
            <input
              type="range"
              min="1.5"
              max="2.2"
              step="0.1"
              value={lineHeight}
              onChange={(e) => setLineHeight(Number(e.target.value))}
              className="w-full h-1 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>
      </div>

      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">滚动同步</span>
          </div>
          <button
            onClick={() => setSyncScroll(!syncScroll)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              syncScroll ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-600"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                syncScroll ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          开启后，编辑区与预览区将同步滚动
        </p>
      </div>
    </div>
  );
}

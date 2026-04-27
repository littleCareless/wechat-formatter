import type React from "react";
import type { ActiveTab } from "../_types/formatter";

type PreviewPaneProps = {
  activeTab: ActiveTab;
  previewRef: React.RefObject<HTMLDivElement | null>;
  onPreviewScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  outputHtml: string;
};

export function PreviewPane({
  activeTab,
  previewRef,
  onPreviewScroll,
  outputHtml,
}: PreviewPaneProps) {
  return (
    <div
      ref={previewRef}
      onScroll={onPreviewScroll}
      className={`flex-[1.2] flex-col overflow-y-auto ${activeTab === "preview" ? "flex" : "hidden md:flex"} custom-scrollbar`}
    >
      <div className="flex-1 bg-linear-to-br from-gray-100 to-gray-200/50 dark:from-gray-800 dark:to-gray-900/50 rounded-2xl shadow-inner border border-gray-200 dark:border-gray-700 flex justify-center py-6 px-4 md:py-8">
        <div className="bg-white dark:bg-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-[2.5rem] p-1.5 border-4 border-gray-800 h-fit min-h-[667px] w-full max-w-[375px] shrink-0 relative transition-all duration-300 transform origin-top hover:scale-[1.02]">
          <div className="absolute top-0 inset-x-0 h-7 flex justify-between items-center px-6 z-10 pointer-events-none">
            <div className="text-[10px] text-gray-800 dark:text-gray-200 font-medium">9:41</div>
            <div className="w-24 h-5 bg-gray-800 rounded-b-xl absolute left-1/2 -translate-x-1/2"></div>
            <div className="flex gap-1">
              <div className="w-3 h-2 bg-gray-800 rounded-sm"></div>
              <div className="w-3 h-2 bg-gray-800 rounded-sm"></div>
            </div>
          </div>
          <div className="bg-gray-100/80 dark:bg-gray-700 pt-10 pb-2 px-4 text-center border-b border-gray-200 dark:border-gray-600 rounded-t-4xl">
            <div className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">
              文章预览
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 w-full rounded-b-4xl overflow-hidden flex flex-col pt-2 pb-6">
            <div className="flex-1 overflow-visible">
              <div
                className="w-full prose-img:max-w-full"
                dangerouslySetInnerHTML={{
                  __html:
                    outputHtml ||
                    '<div style="padding:40px;text-align:center;color:#999;font-size:14px;background-color:#f3f4f6;border-radius:8px;margin:20px;">这里空空如也，请在左侧输入内容</div>',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

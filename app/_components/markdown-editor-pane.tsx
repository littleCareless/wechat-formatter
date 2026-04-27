import {
  Code2,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  List,
  ListOrdered,
  Loader2,
  Minus,
  Quote,
  Settings,
  Sparkles,
} from "lucide-react";
import type React from "react";
import type { ActiveTab, WordCount } from "../_types/formatter";

type MarkdownEditorPaneProps = {
  activeTab: ActiveTab;
  inputText: string;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  onInputScroll: (e: React.UIEvent<HTMLTextAreaElement>) => void;
  onPaste: (e: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  wordCount: WordCount;
  insertMarkdown: (prefix: string, suffix?: string, placeholder?: string) => void;
  insertHeading: (level: number) => void;
  insertList: (type: "ul" | "ol") => void;
  insertCodeBlock: () => void;
  insertLink: () => void;
  insertImage: () => void;
  onAiFormat: () => void;
  isAiFormatting: boolean;
  onOpenAiConfig: () => void;
  onRestoreSample: () => void;
};

export function MarkdownEditorPane({
  activeTab,
  inputText,
  setInputText,
  inputRef,
  onInputScroll,
  onPaste,
  wordCount,
  insertMarkdown,
  insertHeading,
  insertList,
  insertCodeBlock,
  insertLink,
  insertImage,
  onAiFormat,
  isAiFormatting,
  onOpenAiConfig,
  onRestoreSample,
}: MarkdownEditorPaneProps) {
  return (
    <div
      className={`flex-[1.2] flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden ${activeTab === "input" ? "flex" : "hidden md:flex"}`}
    >
      <div className="bg-[#f8f9fa] dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center shrink-0">
        <span className="text-sm font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-500" />
          Markdown 输入
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={onAiFormat}
            className="text-xs text-white bg-linear-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all px-3 py-1.5 rounded-full font-bold shadow-sm flex items-center gap-1.5"
            disabled={!inputText.trim() || isAiFormatting}
            title="使用 AI 优化当前 Markdown 排版结构"
          >
            {isAiFormatting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            {isAiFormatting ? "排版中..." : "一键排版"}
          </button>
          <button
            onClick={onOpenAiConfig}
            className="p-1.5 rounded-full bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors"
            title="配置 AI 服务"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRestoreSample}
            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded"
          >
            恢复示例内容
          </button>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 px-3 py-2 border-b border-gray-200 dark:border-gray-600 flex flex-wrap items-center gap-1 shrink-0">
        <div className="flex items-center gap-1 mr-2">
          <button
            onClick={() => insertHeading(1)}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors text-sm font-bold"
            title="一级标题"
          >
            H1
          </button>
          <button
            onClick={() => insertHeading(2)}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors text-sm font-bold"
            title="二级标题"
          >
            H2
          </button>
          <button
            onClick={() => insertHeading(3)}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors text-sm font-bold"
            title="三级标题"
          >
            H3
          </button>
        </div>
        <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1" />
        <button
          onClick={() => insertMarkdown("**", "**", "加粗")}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors font-bold"
          title="加粗 (Ctrl+B)"
        >
          B
        </button>
        <button
          onClick={() => insertMarkdown("*", "*", "斜体")}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors italic"
          title="斜体 (Ctrl+I)"
        >
          I
        </button>
        <button
          onClick={() => insertMarkdown("~~", "~~", "删除线")}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors line-through"
          title="删除线"
        >
          S
        </button>
        <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1" />
        <button
          onClick={() => insertList("ul")}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
          title="无序列表"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => insertList("ol")}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
          title="有序列表"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          onClick={() => insertMarkdown("> ", "", "引用内容")}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
          title="引用"
        >
          <Quote className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1" />
        <button
          onClick={() => insertMarkdown("`", "`", "代码")}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors font-mono text-sm"
          title="行内代码"
        >
          {"</>"}
        </button>
        <button
          onClick={insertCodeBlock}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
          title="代码块"
        >
          <Code2 className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1" />
        <button
          onClick={insertLink}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
          title="链接"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          onClick={insertImage}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
          title="图片"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => insertMarkdown("---\n", "", "")}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
          title="分隔线"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      <textarea
        ref={inputRef}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onScroll={onInputScroll}
        onPaste={onPaste}
        className="flex-1 w-full p-4 lg:p-6 resize-none focus:outline-none text-gray-700 dark:text-gray-200 leading-relaxed font-mono text-[14px] bg-[#fafafa] dark:bg-gray-900 overflow-y-auto custom-scrollbar"
        placeholder="支持标准 Markdown 语法：&#10;# 标题支持1-6级&#10;> 引用内容&#10;- 列表项1&#10;- 列表项2&#10;**加粗文字**"
      />

      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 border-t border-gray-200 dark:border-gray-600 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 shrink-0">
        <div className="flex items-center gap-4">
          <span>
            字符: <strong className="text-gray-700 dark:text-gray-200">{wordCount.chars}</strong>
          </span>
          <span>
            字数: <strong className="text-gray-700 dark:text-gray-200">{wordCount.words}</strong>
          </span>
          <span>
            预计阅读:{" "}
            <strong className="text-gray-700 dark:text-gray-200">{wordCount.readTime}分钟</strong>
          </span>
        </div>
        <span className="text-gray-400 dark:text-gray-500">支持 Ctrl+V 粘贴图片</span>
      </div>
    </div>
  );
}

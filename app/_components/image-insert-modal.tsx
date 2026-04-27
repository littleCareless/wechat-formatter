import { Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import type React from "react";

type ImageInsertModalProps = {
  open: boolean;
  imageDesc: string;
  setImageDesc: React.Dispatch<React.SetStateAction<string>>;
  imageUrl: string;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
  onClose: () => void;
  onLocalImage: () => void;
  onOnlineImage: () => void;
};

export function ImageInsertModal({
  open,
  imageDesc,
  setImageDesc,
  imageUrl,
  setImageUrl,
  onClose,
  onLocalImage,
  onOnlineImage,
}: ImageInsertModalProps) {
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
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">插入图片</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">选择本地图片或输入在线图片地址</p>
        </div>

        <div className="space-y-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              图片描述
            </label>
            <input
              type="text"
              value={imageDesc}
              onChange={(e) => setImageDesc(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="输入图片描述（可选）"
            />
          </div>

          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
              <span className="text-xs text-gray-400">或</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              在线图片地址
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.png"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onLocalImage}
            className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            <ImageIcon className="w-4 h-4" />
            选择本地图片
          </button>
          <button
            onClick={onOnlineImage}
            disabled={!imageUrl.trim()}
            className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed"
          >
            <LinkIcon className="w-4 h-4" />
            插入在线图片
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-3 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-xl font-medium transition-colors"
        >
          取消
        </button>
      </div>
    </div>
  );
}

import { Coffee } from "lucide-react";

type RewardModalProps = {
  open: boolean;
  onClose: () => void;
};

export function RewardModal({ open, onClose }: RewardModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center justify-center gap-2">
            <Coffee className="w-5 h-5 text-amber-500" />
            请作者喝杯咖啡
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            如果这个工具对你有帮助，欢迎支持一下~
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-4">
          <img
            src="/reward.png"
            alt="赞赏码"
            className="w-48 h-48 mx-auto object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              target.parentElement!.innerHTML =
                '<div class="w-48 h-48 mx-auto flex items-center justify-center text-gray-400 text-sm">请将赞赏码保存为<br/>public/reward.png</div>';
            }}
          />
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center mb-4">
          微信扫码赞赏，支持开发者继续维护
        </p>
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-xl font-medium transition-colors"
        >
          关闭
        </button>
      </div>
    </div>
  );
}

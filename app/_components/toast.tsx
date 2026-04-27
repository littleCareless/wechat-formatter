import { Check, X } from "lucide-react";
import type { ToastState } from "../_types/formatter";

type ToastProps = {
  toast: ToastState;
};

export function Toast({ toast }: ToastProps) {
  if (!toast) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300 transition-all">
      <div
        className={`px-5 py-2.5 rounded-full shadow-lg text-sm font-medium flex items-center gap-2 ${toast.type === "success" ? "bg-[#07c160] text-white shadow-green-500/20" : "bg-red-500 text-white shadow-red-500/20"}`}
      >
        {toast.type === "success" ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
        {toast.message}
      </div>
    </div>
  );
}

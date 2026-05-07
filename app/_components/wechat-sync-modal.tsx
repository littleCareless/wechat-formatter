import { ExternalLink, HelpCircle, ImageIcon, Loader2, Send, ShieldCheck, Upload } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import type { WeChatAccountConfig, WeChatSyncRequest, WeChatSyncResponse, WeChatSyncStatus } from "../_types/wechat";

type WeChatSyncModalProps = {
  open: boolean;
  onClose: () => void;
  html: string;
  markdown: string;
  title: string;
  config: WeChatAccountConfig;
  onSaveConfig: (config: WeChatAccountConfig) => void;
  showToast: (message: string, type: "success" | "error") => void;
};

export function WeChatSyncModal({
  open,
  onClose,
  html,
  markdown,
  title,
  config,
  onSaveConfig,
  showToast,
}: WeChatSyncModalProps) {
  const [activeTab, setActiveTab] = useState<"sync" | "config">("sync");
  const [draftConfig, setDraftConfig] = useState<WeChatAccountConfig>(config);
  const [status, setStatus] = useState<WeChatSyncStatus>("idle");
  const [errorDetails, setErrorDetails] = useState<string>("");
  const [serverIp, setServerIp] = useState<string>("");
  const [coverImage, setCoverImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setDraftConfig(config);
      setErrorDetails("");
      setStatus("idle");
      // 获取服务器 IP 用于白名单配置
      fetch("/api/wechat/ip").then(res => res.json()).then(data => setServerIp(data.ip));
      
      // 自动尝试从 HTML 提取第一张图作为默认封面预览
      const imgMatch = html.match(/<img[^>]+src="([^">]+)"/i);
      if (imgMatch) {
        setCoverImage(imgMatch[1]);
      } else {
        setCoverImage("");
      }
    }
  }, [open, config, html]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCoverImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSync = async () => {
    if (!draftConfig.appId || !draftConfig.appSecret) {
      setActiveTab("config");
      showToast("请先完成公众号配置", "error");
      return;
    }

    setStatus("authorizing");
    setErrorDetails("");

    try {
      const requestData: WeChatSyncRequest = {
        html,
        markdown,
        title: title || "未命名文章",
        config: draftConfig,
        coverImage: coverImage, // 传递选定的封面图
      };

      const data = (await response.json()) as WeChatSyncResponse;

      if (data.success) {
        setStatus("success");
        showToast("同步成功！", "success");
      } else {
        setStatus("error");
        setErrorDetails(data.details || data.error || "未知错误");
        // 如果后端返回了精准检测到的 IP，更新它
        if ((data as any).detectedIp) {
          setServerIp((data as any).detectedIp);
        }
      }
    } catch (err: unknown) {
      setStatus("error");
      setErrorDetails(err instanceof Error ? err.message : "请求失败");
    }
  };

  const handleSaveConfig = () => {
    onSaveConfig(draftConfig);
    showToast("配置已保存到本地", "success");
    setActiveTab("sync");
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center neo-modal-backdrop"
      onClick={onClose}
    >
      <div
        className="neo-modal flex flex-col max-w-lg w-full mx-4 transform transition-all max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center p-6 pb-4 shrink-0 border-b-[3px] border-(--neo-ink)">
          <h3 className="text-xl font-black text-(--neo-ink) mb-2 uppercase flex items-center justify-center gap-2">
            <Send className="w-5 h-5" />
            同步到公众号
          </h3>
          <p className="text-sm neo-text-muted font-bold">
            一键将当前排版好的文章推送到草稿箱
          </p>
        </div>

        <div className="flex border-b-[3px] border-(--neo-ink) bg-(--neo-cyan)">
          <button
            onClick={() => setActiveTab("sync")}
            className={`flex-1 py-3 font-black text-sm uppercase transition-colors ${
              activeTab === "sync" ? "bg-(--neo-yellow) text-(--neo-ink)" : "hover:bg-white/20"
            }`}
          >
            立即同步
          </button>
          <button
            onClick={() => setActiveTab("config")}
            className={`flex-1 py-3 font-black text-sm uppercase transition-colors ${
              activeTab === "config" ? "bg-(--neo-yellow) text-(--neo-ink)" : "hover:bg-white/20"
            }`}
          >
            账号设置
          </button>
        </div>

        <div className="flex-1 overflow-y-auto neo-scrollbar p-6 py-4">
          {activeTab === "sync" ? (
            <div className="space-y-6">
              {status === "success" ? (
                <div className="py-8 text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-(--neo-green) border-[3px] border-(--neo-ink) flex items-center justify-center shadow-[4px_4px_0_0_var(--neo-ink)]">
                      <ShieldCheck className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-black text-(--neo-ink)">同步成功！</p>
                    <p className="text-sm font-bold text-(--neo-muted)">文章已推送到你的微信公众号草稿箱</p>
                  </div>
                  
                  <div className="bg-(--neo-yellow) border-[3px] border-(--neo-ink) p-4 text-left space-y-2">
                    <p className="text-xs font-black flex items-center gap-1">
                      <HelpCircle className="w-3 h-3" />
                      后续步骤：
                    </p>
                    <p className="text-[11px] font-bold leading-relaxed">
                      微信 API 限制无法直接发布，请务必前往 <span className="underline">微信公众平台</span> 后台，在“草稿箱”中确认内容并手动点击“发布”。
                    </p>
                  </div>

                  <a 
                    href="https://mp.weixin.qq.com/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="neo-button neo-button-primary w-full py-3 inline-flex items-center justify-center gap-2"
                  >
                    前往公众平台后台 <ExternalLink className="w-4 h-4" />
                  </a>
                  
                  <button
                    onClick={() => setStatus("idle")}
                    className="text-xs font-black underline text-(--neo-muted)"
                  >
                    返回同步界面
                  </button>
                </div>
              ) : status === "idle" ? (
                <div className="space-y-4">
                  <div className="border-[3px] border-(--neo-ink) p-4 bg-(--neo-surface) space-y-4">
                    <div>
                      <p className="text-sm font-black mb-1 text-(--neo-ink)">待同步标题：</p>
                      <p className="text-lg font-black text-(--neo-ink)">{title || "（未设置标题）"}</p>
                    </div>

                    <div>
                      <p className="text-sm font-black mb-2 text-(--neo-ink)">文章封面：</p>
                      <div 
                        className="relative border-[3px] border-dashed border-(--neo-ink) rounded-lg overflow-hidden bg-white aspect-[2.35/1] flex flex-col items-center justify-center group cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {coverImage ? (
                          <>
                            <img src={coverImage} alt="封面预览" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <p className="text-white font-black text-sm flex items-center gap-2">
                                <Upload className="w-4 h-4" /> 更换封面
                              </p>
                            </div>
                          </>
                        ) : (
                          <div className="text-center p-4">
                            <ImageIcon className="w-8 h-8 mx-auto mb-2 text-(--neo-muted)" />
                            <p className="text-xs font-black text-(--neo-muted)">点击上传封面图</p>
                            <p className="text-[10px] text-(--neo-muted)/60 mt-1">推荐比例 2.35:1 (900x383)</p>
                          </div>
                        )}
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        className="hidden" 
                      />
                    </div>
                  </div>
                  
                  <div className="bg-(--neo-pink) border-[3px] border-(--neo-ink) p-3 text-xs font-bold leading-relaxed">
                    <p className="flex items-center gap-1 mb-1">
                      <ShieldCheck className="w-3 h-3" />
                      温馨提示：
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>同步前请确保正文内容已调整至最佳。</li>
                      <li>后端将自动处理 Base64 图片并上传至微信。</li>
                      <li>如果未设置封面图，将默认抓取正文第一张图。</li>
                    </ul>
                  </div>

                  <button
                    onClick={handleSync}
                    className="neo-button neo-button-primary w-full py-4 text-lg"
                  >
                    开始同步到草稿箱
                  </button>
                </div>
              ) : status === "error" ? (
                <div className="space-y-4">
                  <div className="border-[3px] border-(--neo-ink) p-4 bg-red-100 text-red-900 font-bold">
                    <p className="text-sm uppercase mb-2 underline">同步失败</p>
                    <p className="text-sm break-all">{errorDetails}</p>
                  </div>
                  
                  {errorDetails.includes("40164") || errorDetails.includes("白名单") ? (
                    <div className="border-[3px] border-(--neo-ink) p-4 bg-(--neo-yellow) space-y-2">
                      <p className="text-xs font-black">检测到可能是 IP 白名单问题：</p>
                      <p className="text-xs font-bold">请将以下 IP 添加到公众号后台 [基本配置-IP白名单]：</p>
                      <code className="block bg-black text-white p-2 text-center text-sm rounded">{serverIp || "获取中..." }</code>
                    </div>
                  ) : null}

                  <button
                    onClick={handleSync}
                    className="neo-button neo-button-primary w-full py-3"
                  >
                    重试同步
                  </button>
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center space-y-4">
                  <Loader2 className="w-12 h-12 animate-spin text-(--neo-ink)" />
                  <p className="font-black text-(--neo-ink) animate-pulse">
                    {status === "authorizing" && "正在获取微信授权..."}
                    {status === "uploading_images" && "正在转存图片至微信..."}
                    {status === "creating_draft" && "正在创建草稿..."}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-black text-(--neo-ink) mb-1">
                  AppID
                </label>
                <input
                  type="text"
                  value={draftConfig.appId}
                  onChange={(e) => setDraftConfig({ ...draftConfig, appId: e.target.value })}
                  className="neo-input w-full px-3 py-2"
                  placeholder="微信公众号后台获取"
                  autoComplete="off"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-(--neo-ink) mb-1">
                  AppSecret
                </label>
                <input
                  type="password"
                  value={draftConfig.appSecret}
                  onChange={(e) => setDraftConfig({ ...draftConfig, appSecret: e.target.value })}
                  className="neo-input w-full px-3 py-2"
                  placeholder="请确保已重置并保存"
                  autoComplete="off"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-(--neo-ink) mb-1">
                  文章作者 (可选)
                </label>
                <input
                  type="text"
                  value={draftConfig.author}
                  onChange={(e) => setDraftConfig({ ...draftConfig, author: e.target.value })}
                  className="neo-input w-full px-3 py-2"
                  placeholder="文章显示的作者名称"
                />
              </div>

              <div className="bg-(--neo-cyan) border-[3px] border-(--neo-ink) p-4 space-y-2">
                <p className="text-xs font-black flex items-center gap-1">
                  <HelpCircle className="w-3 h-3" />
                  如何获取？
                </p>
                <ol className="text-[10px] font-bold list-decimal list-inside space-y-2 text-(--neo-ink)/80">
                  <li>登录微信开发者平台 (developers.weixin.qq.com/console)</li>
                  <li>选择对应的公众号 &gt; 基础信息</li>
                  <li>在此页面可直接获取 AppID 和获取/重置 AppSecret</li>
                  <li className="space-y-1">
                    <span className="text-(--neo-pink) font-black">关键步骤：</span>将以下 IP 地址填入微信后台的 <span className="underline">IP白名单</span> 中：
                    <div className="flex items-center gap-2 mt-1">
                      <code className="bg-black text-white px-3 py-1.5 rounded text-sm flex-1 text-center font-mono">
                        {serverIp || '正在获取 IP...'}
                      </code>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(serverIp);
                          showToast("IP 已复制到剪贴板", "success");
                        }}
                        className="neo-button neo-button-secondary text-[10px] py-1 px-2"
                        title="点击复制 IP"
                      >
                        复制
                      </button>
                    </div>
                  </li>
                </ol>
                <a 
                  href="https://developers.weixin.qq.com/console/index" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-[10px] font-black underline flex items-center gap-1 mt-2"
                >
                  前往微信开发者平台 <ExternalLink className="w-2 h-2" />
                </a>
              </div>

              <p className="text-[10px] neo-text-muted font-bold">
                * 凭证仅存储在浏览器本地，同步时临时通过加密通道发送至后端处理。
              </p>

              <button
                onClick={handleSaveConfig}
                className="neo-button neo-button-primary w-full py-3 mt-2"
              >
                保存配置
              </button>
            </div>
          )}
        </div>

        <div className="p-6 pt-0 shrink-0">
          <button
            onClick={onClose}
            className="neo-button neo-button-ghost w-full py-2.5"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}

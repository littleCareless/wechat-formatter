import axios from "axios";
import sharp from "sharp";

const WECHAT_API_BASE = "https://api.weixin.qq.com/cgi-bin";

/**
 * 获取微信 Access Token
 */
export async function getWeChatAccessToken(appId: string, appSecret: string): Promise<string> {
  const url = `${WECHAT_API_BASE}/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;
  const res = await axios.get(url, { timeout: 10000 });
  
  if (res.data.errcode) {
    const errMsg = res.data.errmsg || "";
    if (res.data.errcode === 40164) {
      const ipMatch = errMsg.match(/invalid ip ([0-9.]+)/);
      const detectedIp = ipMatch ? ipMatch[1] : "";
      const error = new Error(detectedIp ? `IP白名单错误：请将 IP [${detectedIp}] 加入微信后台白名单` : errMsg);
      (error as any).errcode = 40164;
      (error as any).detectedIp = detectedIp;
      throw error;
    }
    throw new Error(`获取授权失败: ${res.data.errmsg} (${res.data.errcode})`);
  }
  
  return res.data.access_token;
}

/**
 * 上传正文图片到微信服务器
 */
export async function uploadImageToWeChat(accessToken: string, imageBuffer: Buffer, filename: string): Promise<string> {
  // 微信要求图片 < 1MB 且仅支持 jpg/png
  let processedBuffer = imageBuffer;
  
  try {
    // 仅当图片 > 1MB 时才尝试使用 sharp 压缩，减少 native 模块调用压力
    if (imageBuffer.length > 1024 * 1024) {
      processedBuffer = await sharp(imageBuffer)
        .resize(1080, undefined, { withoutEnlargement: true })
        .toFormat('jpeg', { quality: 80 })
        .toBuffer();
    }
  } catch (e) {
    console.error("Sharp processing failed, attempting original upload:", e);
    // 如果 sharp 失败但原图 < 1MB，依然可以尝试上传
    if (imageBuffer.length > 1024 * 1024) {
      throw new Error("图片过大且压缩失败，请手动减小图片体积后再试");
    }
  }

  const url = `${WECHAT_API_BASE}/media/uploadimg?access_token=${accessToken}`;
  const formData = new FormData();
  const blob = new Blob([new Uint8Array(processedBuffer)], { type: 'image/jpeg' });
  formData.append('media', blob, filename.endsWith('.png') || filename.endsWith('.jpg') ? filename : `${filename}.jpg`);

  const res = await fetch(url, {
    method: 'POST',
    body: formData,
    signal: AbortSignal.timeout(15000) // 15秒超时
  });
  
  const data = await res.json();
  if (data.errcode) {
    throw new Error(`图片上传失败: ${data.errmsg}`);
  }
  
  return data.url;
}

/**
 * 上传封面图（永久素材）
 */
export async function uploadCoverToWeChat(accessToken: string, imageBuffer: Buffer, filename: string): Promise<string> {
  let processedBuffer = imageBuffer;
  
  try {
    // 封面图强制进行比例裁剪和压缩以符合微信推荐规格 (900x383)
    processedBuffer = await sharp(imageBuffer)
      .resize(900, 383, { fit: 'cover' })
      .toFormat('jpeg', { quality: 85 })
      .toBuffer();
  } catch (e) {
    console.error("Cover sharp processing failed:", e);
    // 封面图如果不处理，微信后台可能会拒绝或显示异常，但我们可以尝试直接传原图
  }

  const url = `${WECHAT_API_BASE}/material/add_material?access_token=${accessToken}&type=image`;
  const formData = new FormData();
  const blob = new Blob([new Uint8Array(processedBuffer)], { type: 'image/jpeg' });
  formData.append('media', blob, filename);

  const res = await fetch(url, {
    method: 'POST',
    body: formData,
    signal: AbortSignal.timeout(20000)
  });
  
  const data = await res.json();
  if (data.errcode) {
    throw new Error(`封面上传失败: ${data.errmsg}`);
  }
  
  return data.media_id;
}

/**
 * 处理正文内容：转存图片并替换 URL (轻量化 Regex 版本)
 */
export async function processHtmlImages(accessToken: string, html: string): Promise<string> {
  /**
   * 放弃内存沉重的 JSDOM，改用 Regex 全局查找并替换 img 标签
   * 这种方式内存占用极低，能有效防止 Vercel 500/OOM 错误
   */
  const imgRegex = /<img[^>]+src="([^">]+)"/gi;
  let finalHtml = html;
  const matches = Array.from(html.matchAll(imgRegex));

  for (const match of matches) {
    const fullTag = match[0];
    const src = match[1];
    if (!src) continue;

    try {
      let imageBuffer: Buffer;
      let filename = "image.jpg";

      if (src.startsWith("data:image")) {
        imageBuffer = Buffer.from(src.split(",")[1], "base64");
        const mime = src.match(/data:image\/([^;]+);/)?.[1] || "jpeg";
        filename = `image.${mime}`;
      } else if (src.startsWith("http")) {
        const res = await axios.get(src, { 
          responseType: "arraybuffer", 
          timeout: 8000 
        });
        imageBuffer = Buffer.from(res.data);
        filename = src.split("/").pop() || "image.jpg";
      } else {
        continue;
      }

      const wechatUrl = await uploadImageToWeChat(accessToken, imageBuffer, filename);
      
      // 生成新的标签，保留原有的 class/style 等属性，仅替换 src 和增加 data-src
      const newTag = fullTag
        .replace(/src="[^">]+"/i, `src="${wechatUrl}"`)
        .replace(/>$/, ` data-src="${wechatUrl}">`);
      
      finalHtml = finalHtml.replace(fullTag, newTag);
    } catch (err) {
      console.error(`Skipping image [${src}] due to error:`, err);
    }
  }

  return finalHtml;
}

/**
 * 新建草稿
 */
export async function addWeChatDraft(
  accessToken: string,
  title: string,
  content: string,
  thumbMediaId: string,
  author: string = "",
  digest: string = ""
): Promise<string> {
  const url = `${WECHAT_API_BASE}/draft/add?access_token=${accessToken}`;
  
  const res = await axios.post(url, {
    articles: [{
      title,
      author,
      digest,
      content,
      thumb_media_id: thumbMediaId,
      need_open_comment: 0,
      only_fans_can_comment: 0
    }]
  });
  
  if (res.data.errcode) {
    throw new Error(`新建草稿失败: ${res.data.errmsg} (${res.data.errcode})`);
  }
  
  return res.data.media_id;
}

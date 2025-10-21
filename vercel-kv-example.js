// 使用 Vercel KV 的示例代码
// 需要在 Vercel 项目中启用 KV 存储

import { kv } from '@vercel/kv';

// 保存 URL
await kv.set('pdf-urls', JSON.stringify(urlsArray));

// 获取 URL
const savedUrls = await kv.get('pdf-urls');
const urls = savedUrls ? JSON.parse(savedUrls) : [];

// 添加新 URL
urls.push(newUrl);
await kv.set('pdf-urls', JSON.stringify(urls));
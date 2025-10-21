// 使用 Vercel Postgres 的示例代码
import { sql } from '@vercel/postgres';

// 创建表
await sql`
  CREATE TABLE IF NOT EXISTS pdf_urls (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

// 保存 URL
await sql`
  INSERT INTO pdf_urls (url) VALUES (${pdfUrl})
`;

// 获取所有 URL
const { rows } = await sql`SELECT url, created_at FROM pdf_urls ORDER BY created_at DESC`;
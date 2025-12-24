import { notFound } from 'next/navigation';

export interface Note {
  id: string;
  title: string;
  slug: string;
  date: string;
  content: string;
  tags?: string[];
  pinned?: boolean;
}

// ⚠️ 确保这些变量名和你 Cloudflare 后台设置的一模一样
const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const TABLE_NAME = 'Notes'; 

async function fetchAirtable(url: string) {
  // 如果没有 Token，直接报错
  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) {
    console.error("❌ 错误: 缺少 Airtable 环境变量 (AIRTABLE_TOKEN 或 AIRTABLE_BASE_ID)");
    return null;
  }

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 0 }, // 0 表示不做缓存，每次都取最新的，方便调试
    });

    if (!res.ok) {
      console.error(`❌ Airtable API 报错: ${res.status} ${res.statusText}`);
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error("❌ 网络请求失败:", error);
    return null;
  }
}

export async function getPublishedPosts(): Promise<Note[]> {
  // 这里的查询条件是：筛选 Published 勾选的，按日期降序
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TABLE_NAME}?filterByFormula={Published}&sort%5B0%5D%5Bfield%5D=Date&sort%5B0%5D%5Bdirection%5D=desc`;
  
  const data = await fetchAirtable(url);
  if (!data || !data.records) return [];

  return data.records.map((record: any) => ({
    id: record.id,
    title: record.fields.Title || "Untitled",
    slug: record.fields.Slug || "",
    date: record.fields.Date || "",
    content: record.fields.Content || "",
    tags: record.fields.Tags || [],
    pinned: record.fields.Pinned || false,
  }));
}

export async function getPostBySlug(slug: string): Promise<Note | null> {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TABLE_NAME}?filterByFormula=AND({Published}, {Slug}='${slug}')`;

  const data = await fetchAirtable(url);
  
  if (!data || !data.records || data.records.length === 0) {
    return null;
  }

  const record = data.records[0];
  return {
    id: record.id,
    title: record.fields.Title || "Untitled",
    slug: record.fields.Slug || "",
    date: record.fields.Date || "",
    content: record.fields.Content || "",
    tags: record.fields.Tags || [],
    pinned: record.fields.Pinned || false,
  };
}
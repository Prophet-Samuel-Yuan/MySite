import { notFound } from 'next/navigation';

// 定义笔记的数据结构
export interface Note {
  id: string;
  title: string;
  slug: string;
  date: string;
  content: string;
  tags?: string[];
  pinned?: boolean;
}

// 检查环境变量 (防止构建时报错)
const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const TABLE_NAME = 'Notes'; // ⚠️ 确保你的 Airtable 表名是 "Notes"

// 通用的 Fetch 函数 (替代官方 SDK)
async function fetchAirtable(url: string) {
  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) {
    console.error("Missing Airtable environment variables");
    return null;
  }

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 }, // 缓存 60 秒
    });

    if (!res.ok) {
      throw new Error(`Airtable API Error: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Fetch Airtable failed:", error);
    return null;
  }
}

// 1. 获取所有已发布文章 (用于侧边栏)
export async function getPublishedPosts(): Promise<Note[]> {
  // 构造查询 URL：筛选 Published = true，按 Date 降序排列
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

// 2. 根据 Slug 获取单篇文章
export async function getPostBySlug(slug: string): Promise<Note | null> {
  // 构造查询 URL：筛选 Slug = 目标值
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
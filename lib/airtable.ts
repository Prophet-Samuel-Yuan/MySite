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

// 环境变量检查
const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

// ✅ 1. 修正表名：截图显示你的表名叫 'Posts'
const TABLE_NAME = 'Posts'; 

async function fetchAirtable(url: string) {
  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) {
    console.error("❌ 错误: 缺少 Airtable 环境变量");
    return null;
  }

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 0 }, // 禁用缓存，方便调试
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
  // ✅ 2. 修正筛选逻辑：
  //    截图显示你用的是 'Status' 列（单选）。
  //    这里假设你要展示的状态叫 'Published'。如果你的选项叫 'Done'，请修改这里。
  const filterFormula = `{Status} = 'Published'`;
  
  // ✅ 3. 修正排序字段：截图显示你的日期列叫 'PublishedDate'
  const sortField = 'PublishedDate';

  // 构造 URL
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TABLE_NAME}?filterByFormula=${encodeURIComponent(filterFormula)}&sort%5B0%5D%5Bfield%5D=${sortField}&sort%5B0%5D%5Bdirection%5D=desc`;
  
  const data = await fetchAirtable(url);
  if (!data || !data.records) return [];

  return data.records.map((record: any) => ({
    id: record.id,
    title: record.fields.Title || "Untitled",
    slug: record.fields.Slug || "",
    // ✅ 4. 修正日期映射：从 'PublishedDate' 读取
    date: record.fields.PublishedDate || "",
    content: record.fields.Content || "",
    tags: record.fields.Tags || [],
    pinned: record.fields.Pinned || false,
  }));
}

export async function getPostBySlug(slug: string): Promise<Note | null> {
  // ✅ 5. 修正单篇文章查询逻辑：同样匹配 Status 和 PublishedDate
  const filterFormula = `AND({Status}='Published', {Slug}='${slug}')`;
  
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TABLE_NAME}?filterByFormula=${encodeURIComponent(filterFormula)}`;

  const data = await fetchAirtable(url);
  
  if (!data || !data.records || data.records.length === 0) {
    return null;
  }

  const record = data.records[0];
  return {
    id: record.id,
    title: record.fields.Title || "Untitled",
    slug: record.fields.Slug || "",
    // ✅ 6. 修正日期映射
    date: record.fields.PublishedDate || "",
    content: record.fields.Content || "",
    tags: record.fields.Tags || [],
    pinned: record.fields.Pinned || false,
  };
}
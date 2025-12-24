import Airtable from 'airtable';

// 1. 初始化连接
const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN }).base(process.env.AIRTABLE_BASE_ID!);

// 定义文章的数据结构
export interface Post {
  id: string;
  title: string;
  slug: string;
  date: string;
  content: string;
  tags: string[];
}

// 2. 获取所有“已发布”的文章列表
export async function getPublishedPosts(): Promise<Post[]> {
  try {
    const records = await base('Posts').select({
      filterByFormula: "{Status} = 'Published'", // 只抓取状态为 Published 的
      sort: [{ field: 'PublishedDate', direction: 'desc' }] // 按时间倒序
    }).all();

    // 把 Airtable 的奇怪数据格式，洗成我们好用的格式
    return records.map((record) => ({
      id: record.id,
      title: record.get('Title') as string,
      slug: record.get('Slug') as string,
      date: record.get('PublishedDate') as string,
      content: record.get('Content') as string || '',
      tags: (record.get('Tags') as string[]) || [],
    }));
  } catch (error) {
    console.error('获取文章列表失败:', error);
    return [];
  }
}

// 3. 根据 Slug 获取单篇文章 (点进文章详情页用)
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const records = await base('Posts').select({
      filterByFormula: `AND({Status} = 'Published', {Slug} = '${slug}')`,
      maxRecords: 1
    }).all();

    if (records.length === 0) return null;

    const record = records[0];
    return {
      id: record.id,
      title: record.get('Title') as string,
      slug: record.get('Slug') as string,
      date: record.get('PublishedDate') as string,
      content: record.get('Content') as string || '',
      tags: (record.get('Tags') as string[]) || [],
    };
  } catch (error) {
    console.error('获取文章详情失败:', error);
    return null;
  }
}
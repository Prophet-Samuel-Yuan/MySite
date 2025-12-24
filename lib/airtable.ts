import Airtable from 'airtable';

// 1. 定义数据结构
export interface Post {
  id: string;
  title: string;
  slug: string;
  date: string;
  content: string;
  tags: string[];
  pinned: boolean;
}

// 2. 关键修改：不要在文件最开头初始化 Airtable
// 改成用这个函数来获取实例，用到时再调用
const getBase = () => {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;

  // 如果找不到钥匙，只打印警告，不抛出致命错误
  if (!token || !baseId) {
    console.warn("⚠️ Warning: Airtable Environment Variables are missing during build.");
    return null;
  }

  return new Airtable({ apiKey: token }).base(baseId);
};

// 3. 获取列表
export async function getPublishedPosts(): Promise<Post[]> {
  const base = getBase();
  if (!base) return []; // 🛡️ 如果没连上数据库，返回空列表，保命要紧

  try {
    const records = await base('Posts').select({
      filterByFormula: "{Status} = 'Published'",
      sort: [
        { field: 'Pinned', direction: 'desc' },
        { field: 'PublishedDate', direction: 'desc' }
      ]
    }).all();

    return records.map((record) => ({
      id: record.id,
      title: record.get('Title') as string,
      slug: record.get('Slug') as string,
      date: record.get('PublishedDate') as string,
      content: record.get('Content') as string || '',
      tags: (record.get('Tags') as string[]) || [],
      pinned: (record.get('Pinned') as boolean) || false,
    }));
  } catch (error) {
    console.error('获取文章列表失败:', error);
    return [];
  }
}

// 4. 获取详情
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const base = getBase();
  if (!base) return null; // 🛡️ 保命

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
      pinned: (record.get('Pinned') as boolean) || false,
    };
  } catch (error) {
    console.error('获取文章详情失败:', error);
    return null;
  }
}
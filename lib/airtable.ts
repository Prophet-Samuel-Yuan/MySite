import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN }).base(process.env.AIRTABLE_BASE_ID!);

export interface Post {
  id: string;
  title: string;
  slug: string;
  date: string;
  content: string;
  tags: string[];
  pinned: boolean; // 👈 新增：告诉前端这是否是置顶文章
}

export async function getPublishedPosts(): Promise<Post[]> {
  try {
    const records = await base('Posts').select({
      filterByFormula: "{Status} = 'Published'",
      sort: [
        { field: 'Pinned', direction: 'desc' }, // 👈 第一优先级：勾选了 Pinned 的排前面 (true > false)
        { field: 'PublishedDate', direction: 'desc' } // 第二优先级：按时间倒序
      ]
    }).all();

    return records.map((record) => ({
      id: record.id,
      title: record.get('Title') as string,
      slug: record.get('Slug') as string,
      date: record.get('PublishedDate') as string,
      content: record.get('Content') as string || '',
      tags: (record.get('Tags') as string[]) || [],
      pinned: (record.get('Pinned') as boolean) || false, // 👈 获取 Airtable 的勾选状态
    }));
  } catch (error) {
    console.error('获取文章列表失败:', error);
    return [];
  }
}

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
      pinned: (record.get('Pinned') as boolean) || false,
    };
  } catch (error) {
    console.error('获取文章详情失败:', error);
    return null;
  }
}
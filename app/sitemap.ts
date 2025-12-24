import { getPublishedPosts } from '@/lib/airtable';

// ✅ 这一行必须有
export const runtime = 'edge';

export default async function sitemap() {
  const posts = await getPublishedPosts();
  
  const notes = posts.map((post) => ({
    url: `https://你的域名/notes/${post.slug}`, // 这里不用太纠结域名，Cloudflare 会自动处理相对路径
    lastModified: new Date(post.date),
  }));

  return [
    {
      url: 'https://你的域名',
      lastModified: new Date(),
    },
    ...notes,
  ];
}
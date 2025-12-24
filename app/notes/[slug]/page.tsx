import { getPostBySlug, getPublishedPosts } from '@/lib/airtable';
import { notFound } from 'next/navigation';
import Markdown from 'react-markdown';
import Link from 'next/link';

// 1. 这是一个 Next.js 的特殊函数，用于生成静态路由
// 它会告诉 Next.js："我有这 10 篇文章，请提前把页面生成好"
export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// 2. 页面主函数
export default async function NotePage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const post = await getPostBySlug(slug);

  // 如果找不到文章（比如 URL 输错了），显示 404
  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-2xl mx-auto py-12 px-6">
      {/* 返回首页的按钮 */}
      <div className="mb-10">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          ← Back to Notes
        </Link>
      </div>

      {/* 文章头部 */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-500 font-mono">
          <time>{post.date}</time>
          {post.tags.length > 0 && (
            <span>• {post.tags.map(t => `#${t}`).join(' ')}</span>
          )}
        </div>
      </header>

      {/* 文章正文 - 使用 Tailwind Typography 插件美化排版 */}
      <div className="prose prose-neutral prose-lg max-w-none">
        <Markdown>{post.content}</Markdown>
      </div>
    </article>
  );
}
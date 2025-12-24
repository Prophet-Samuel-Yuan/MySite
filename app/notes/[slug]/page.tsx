import { getPublishedPosts, getPostBySlug } from '@/lib/airtable';
import { notFound } from 'next/navigation';

// ✅ 这一行必须有
export const runtime = 'edge';

// 1. 生成静态路由
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

  if (!post) {
    notFound();
  }

  return (
    <article className="prose prose-zinc max-w-2xl mx-auto pt-10 px-6 dark:prose-invert prose-headings:font-bold prose-h1:text-3xl prose-p:text-[17px] prose-p:leading-relaxed prose-p:text-zinc-800 dark:prose-p:text-zinc-200">
      <h1 className="mb-4 text-3xl font-bold">{post.title}</h1>
      <div className="mb-8 text-sm text-neutral-500">
        <time>{post.date}</time>
        {post.tags && post.tags.length > 0 && (
          <span className="ml-4">
            Tags: {post.tags.join(', ')}
          </span>
        )}
      </div>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
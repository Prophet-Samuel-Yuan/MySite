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
    <article className="max-w-3xl mx-auto px-8 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 mb-3">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <time className="font-medium">{post.date}</time>
          {post.tags && post.tags.length > 0 && (
            <>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <span className="font-medium">
                {post.tags.join(', ')}
              </span>
            </>
          )}
        </div>
      </header>
      
      <div 
        className="prose prose-zinc prose-p:text-[17px] prose-p:leading-relaxed prose-headings:font-semibold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg dark:prose-invert prose-p:text-gray-800 dark:prose-p:text-gray-200 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-strong:font-semibold prose-code:text-sm prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded"
        dangerouslySetInnerHTML={{ __html: post.content }} 
      />
    </article>
  );
}

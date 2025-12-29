import { getPublishedPosts } from '@/lib/airtable';
import Link from 'next/link';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Digital Garden",
  description: "A collection of thoughts.",
};

export default async function Home() {
  // 1. 从 Airtable 获取数据
  const posts = await getPublishedPosts();

  // 2. 空状态处理
  if (!posts || posts.length === 0) {
    return <div className="p-10 text-gray-500">No posts yet. Check Airtable status.</div>;
  }

  // 3. 渲染列表
  return (
    <main className="max-w-4xl mx-auto py-12 px-6">
      <header className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 mb-2">
          Notes
        </h1>
        <p className="text-gray-500 dark:text-gray-400">Thinking out loud.</p>
      </header>

      <div className="grid gap-3">
        {posts.map((post) => (
          <Link 
            key={post.id} 
            href={`/notes/${post.slug}`}
            className="group block"
          >
            <article className="rounded-xl bg-white/50 p-5 hover:bg-gray-50 transition-all duration-150 border border-gray-100 dark:border-gray-800 dark:bg-gray-900/50 dark:hover:bg-gray-800/50">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-[17px] font-semibold text-gray-900 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                  {post.title}
                </h2>
                <time className="text-xs text-gray-400 font-medium shrink-0">
                  {post.date}
                </time>
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="mt-2 flex gap-2">
                  {post.tags.map((tag: string, index: number) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          </Link>
        ))}
      </div>
    </main>
  );
}

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
    <main className="max-w-2xl mx-auto py-12 px-6">
      <header className="mb-16">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Notes</h1>
        <p className="text-gray-500">Thinking out loud.</p>
      </header>

      <div className="flex flex-col gap-8">
        {posts.map((post) => (
          <Link 
            key={post.id} 
            href={`/notes/${post.slug}`} // 注意：这里指向 /notes/slug
            className="group block"
          >
            <article className="flex flex-col space-y-1">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-lg font-medium text-gray-900 group-hover:underline underline-offset-4 decoration-gray-300 transition-all">
                  {post.title}
                </h2>
                <time className="text-sm text-gray-400 font-mono shrink-0">
                  {post.date}
                </time>
              </div>
              {/* 如果你想显示标签，就把下面这行注释取消 */}
              {/* <div className="text-xs text-gray-400">{post.tags.join(', ')}</div> */}
            </article>
          </Link>
        ))}
      </div>
    </main>
  );
}
import { getPublishedPosts } from '@/lib/airtable';
import Link from 'next/link';

export default async function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const posts = await getPublishedPosts();

  return (
    <div className="flex min-h-screen bg-white">
      {/* 侧边栏 */}
      <aside className="w-80 border-r border-neutral-200 hidden md:block h-screen overflow-y-auto sticky top-0 bg-neutral-50/50">
        <div className="p-6 border-b border-neutral-200/50 backdrop-blur-sm sticky top-0 z-10 bg-neutral-50/80">
          <Link href="/" className="text-sm font-medium text-neutral-500 hover:text-black transition-colors flex items-center gap-2">
            ← Home
          </Link>
        </div>

        <nav className="flex flex-col">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/notes/${post.slug}`}
              className="p-5 border-b border-neutral-100 hover:bg-white transition-all text-sm group"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="font-medium text-neutral-900 group-hover:text-black truncate pr-2">
                  {/* 如果置顶，显示一个图钉图标 */}
                  {post.pinned && <span className="mr-2 text-neutral-400">📌</span>}
                  {post.title}
                </div>
              </div>
              <time className="text-xs text-neutral-400 font-mono block">
                {post.date}
              </time>
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
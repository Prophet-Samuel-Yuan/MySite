import { getPublishedPosts } from '@/lib/airtable';
// 👇 引用我们刚才做的 Session Provider
import { SessionNotesProvider } from './session-notes'; 
// 👇 引用我们刚才做的 Mac 风格侧边栏
import MacSidebar from '@/components/mac-sidebar'; 

export const runtime = "edge";

export default async function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. 获取数据
  const notes = await getPublishedPosts();

  return (
    // 2. 把数据喂给 Provider
    <SessionNotesProvider initialNotes={notes}>
      <div className="flex min-h-screen w-full bg-white dark:bg-[#1c1c1e]">
        
        {/* 3. 这里直接使用 MacSidebar 组件，替代原来的 <aside>...home...</aside> */}
        <MacSidebar />

        {/* 4. 右侧内容区：加了 sm:pl-80 是为了给左侧固定的侧边栏留出位置 */}
        <main className="flex-1 w-full sm:pl-80 transition-[padding] duration-300">
          {children}
        </main>
        
      </div>
    </SessionNotesProvider>
  );
}
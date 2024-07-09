import { MessageList } from '~/app/_components/MessageList'

export default function Page({ params }: { params: { id: string } }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-8xl">留言紀錄</h1>
        <p className="text-xl">資料更新於 2024 年 07 月 06 日</p>

        <MessageList channelId={params.id} />
      </div>
    </main>
  )
}

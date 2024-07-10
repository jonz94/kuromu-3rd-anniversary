import { ChannelList } from '~/app/_components/ChannelList'
import { LastUpdatedAt } from '~/app/_components/LastUpdatedAt'

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-8xl">留言紀錄</h1>

        <LastUpdatedAt />

        <p className="text-xl">(可以使用 Ctrl + F 或 Command + F 啟用搜尋功能)</p>

        <ChannelList />
      </div>
    </main>
  )
}

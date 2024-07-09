import { Channel } from '~/app/_components/Channel'
import { MessageList } from '~/app/_components/MessageList'

export default function Page({ params }: { params: { id: string } }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <Channel channelId={params.id} />

        <p className="text-xl">資料更新於 2024 年 07 月 06 日</p>

        <MessageList channelId={params.id} />
      </div>
    </main>
  )
}

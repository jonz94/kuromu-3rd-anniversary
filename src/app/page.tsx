import { ChannelList } from '~/app/_components/ChannelList'
import { LastUpdatedAt } from '~/app/_components/LastUpdatedAt'
import { ModeToggle } from '~/components/ModeToggle'

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-12 px-4 py-16">
      <div className="absolute top-8 right-8">
        <ModeToggle></ModeToggle>
      </div>

      <h1 className="text-5xl font-bold tracking-tight sm:text-8xl">留言紀錄</h1>

      <LastUpdatedAt />

      <div className="w-full max-w-screen-xl grow">
        <ChannelList />
      </div>
    </main>
  )
}

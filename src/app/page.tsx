import { ChannelList } from '~/components/ChannelList'
import { Header } from '~/components/Header'
import { LastUpdatedAt } from '~/components/LastUpdatedAt'

export default async function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />

      <main className="flex min-h-screen flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-8xl">庫庫台留言紀錄</h1>

        <LastUpdatedAt />

        <div className="flex w-full max-w-screen-xl grow flex-col">
          <ChannelList />
        </div>
      </main>
    </div>
  )
}

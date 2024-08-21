import { LastUpdatedAt } from '~/app/_components/LastUpdatedAt'
import { VideoList } from '~/app/_components/VideoList'
import { Header } from '~/components/Header'

export default async function Video() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />

      <main className="flex min-h-screen flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-bold tracking-tight sm:text-8xl">直播紀錄</h1>

        <LastUpdatedAt />

        <VideoList />
      </main>
    </div>
  )
}

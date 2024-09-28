import { Header } from '~/components/Header'
import { LastUpdatedAt } from '~/components/LastUpdatedAt'
import { VideoList } from '~/components/VideoList'

export default async function Video() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />

      <main className="flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-bold tracking-tight sm:text-8xl">直播紀錄</h1>

        <LastUpdatedAt />

        <VideoList />
      </main>
    </div>
  )
}

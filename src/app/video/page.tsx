import { LastUpdatedAt } from '~/app/_components/LastUpdatedAt'
import { VideoList } from '~/app/_components/VideoList'
import { ModeToggle } from '~/components/ModeToggle'

export default async function Video() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-12 px-4 py-16">
      <div className="absolute right-8 top-8">
        <ModeToggle></ModeToggle>
      </div>

      <h1 className="text-5xl font-bold tracking-tight sm:text-8xl">直播紀錄</h1>

      <LastUpdatedAt />

      <VideoList />
    </main>
  )
}

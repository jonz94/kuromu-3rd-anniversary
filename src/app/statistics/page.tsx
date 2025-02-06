import { Header } from '~/components/Header'
import { VideoTimeDistribution } from '~/components/VideoTimeDistribution'

export default async function Video() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />

      <main className="flex flex-col items-center justify-center gap-12 px-4 py-16">
        <VideoTimeDistribution />
      </main>
    </div>
  )
}

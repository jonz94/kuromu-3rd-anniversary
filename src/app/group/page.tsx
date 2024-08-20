import { GroupedMessageList } from '~/app/_components/GroupedMessageList'
import { LastUpdatedAt } from '~/app/_components/LastUpdatedAt'
import { ModeToggle } from '~/components/ModeToggle'

export default async function Video() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-12 px-4 py-16">
      <div className="absolute right-8 top-8">
        <ModeToggle></ModeToggle>
      </div>

      <h1 className="text-5xl font-bold tracking-tight sm:text-8xl">test</h1>

      <LastUpdatedAt />

      <GroupedMessageList />
    </main>
  )
}

import { Channel } from '~/app/_components/Channel'
import { LastUpdatedAt } from '~/app/_components/LastUpdatedAt'
import { MessageList } from '~/app/_components/MessageList'
import { ModeToggle } from '~/components/ModeToggle'

export default function Page({ params }: { params: { id: string } }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-12 px-4 py-16">
      <div className="absolute top-8 right-8">
        <ModeToggle></ModeToggle>
      </div>

      <Channel channelId={params.id} />

      <LastUpdatedAt />

      <MessageList channelId={params.id} />
    </main>
  )
}

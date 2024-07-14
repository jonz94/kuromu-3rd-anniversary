import { Channel } from '~/app/_components/Channel'
import { LastUpdatedAt } from '~/app/_components/LastUpdatedAt'
import { MessageList } from '~/app/_components/MessageList'
import { ModeToggle } from '~/components/ModeToggle'
import { NavigateBack } from './NavigateBack'

export default function Page({ params }: { params: { id: string } }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-12 px-4 pt-24 pb-16 sm:pt-16">
      <div className="absolute top-8 left-8">
        <NavigateBack></NavigateBack>
      </div>

      <div className="absolute top-8 right-8">
        <ModeToggle></ModeToggle>
      </div>

      <Channel channelId={params.id} />

      <LastUpdatedAt />

      <MessageList channelId={params.id} />
    </main>
  )
}

import { Channel } from '~/app/_components/Channel'
import { LastUpdatedAt } from '~/app/_components/LastUpdatedAt'
import { MessageList } from '~/app/_components/MessageList'
import { ModeToggle } from '~/components/ModeToggle'
import { NavigateBack } from './NavigateBack'

export default function Page({ params }: { params: { id: string } }) {
  const channelId = params.id

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-12 px-4 pb-16 pt-24 sm:pt-16">
      <div className="absolute left-8 top-8">
        <NavigateBack></NavigateBack>
      </div>

      <div className="absolute right-8 top-8">
        <ModeToggle></ModeToggle>
      </div>

      <div className="min-h-16">
        <Channel channelId={channelId} />
      </div>

      <LastUpdatedAt />

      <div className="flex w-full grow flex-col">
        <MessageList channelId={channelId} />
      </div>
    </main>
  )
}

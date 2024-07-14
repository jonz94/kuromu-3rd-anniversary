import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { Channel } from '~/app/_components/Channel'
import { LastUpdatedAt } from '~/app/_components/LastUpdatedAt'
import { MessageList } from '~/app/_components/MessageList'
import { ModeToggle } from '~/components/ModeToggle'
import { Button } from '~/components/ui/button'

export default function Page({ params }: { params: { id: string } }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-12 px-4 pt-24 pb-16 sm:pt-16">
      <div className="absolute top-8 left-8">
        <Button asChild size="icon">
          <Link href="/" prefetch={false}>
            <ChevronLeft className="size-4" />
          </Link>
        </Button>
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

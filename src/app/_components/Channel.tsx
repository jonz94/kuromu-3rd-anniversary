'use client'

import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '~/components/ui/skeleton'
import { cn } from '~/lib/utils'
import { fetchChannelData } from '~/query'

export function Channel(props: { channelId: string; className?: string }) {
  const {
    data: channel,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['channels', props.channelId],
    queryFn: fetchChannelData(props.channelId),
  })

  if (isLoading) {
    return (
      <div className={cn('flex items-center gap-4', props.className)}>
        <Skeleton className="size-16 min-w-16 rounded-full" />
        <Skeleton className="h-12 w-60 rounded-none" />
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <p>資料載入時發生異常：</p>
        <p>{error.message}</p>
      </div>
    )
  }

  if (!channel) return <div></div>

  return (
    <div className={cn('flex items-center gap-4', props.className)}>
      <span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/data/${channel.id}/avatar.jpg`}
          className="size-16 min-w-16 rounded-full"
          width={160}
          height={160}
          alt={`${channel.name} 的頭像`}
        />
      </span>
      <span className="text-5xl font-bold">{channel.name}</span>
    </div>
  )
}

'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchChannelData } from '~/query'

export function Channel(props: { channelId: string }) {
  const {
    data: channel,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['channels'],
    queryFn: fetchChannelData(props.channelId),
  })

  if (isLoading) return <div>資料載入中...</div>

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
    <div className="flex gap-4 items-center">
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
      <span className="font-bold text-5xl">{channel.name}</span>
    </div>
  )
}

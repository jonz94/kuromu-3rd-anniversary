'use client'

import { useQuery } from '@tanstack/react-query'
import { useWindowVirtualizer } from '@tanstack/react-virtual'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { type ChannelSchema, type ChannelsSchema, fetchChannelsData } from '~/query'

export function ChannelList() {
  const {
    data: allChannels,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['channels'],
    queryFn: fetchChannelsData,
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

  return allChannels ? <ChannelSearch channels={allChannels}></ChannelSearch> : null
}

function ChannelSearch({ channels }: { channels: ChannelsSchema }) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [query, setQuery] = useState('')

  return (
    <div className="w-full max-w-screen-xl">
      <form
        className="flex gap-4 pb-8"
        onSubmit={(e) => {
          e.preventDefault()
          setQuery(inputRef.current?.value ?? '')
        }}
      >
        <Input
          ref={inputRef}
          className="h-12 text-xl font-bold px-4"
          type="search"
          placeholder="搜尋名稱..."
          onKeyUp={(e) => {
            if (e.code === 'Enter') {
              setQuery(inputRef.current?.value ?? '')
            }
          }}
        />

        <Button size="icon" className="size-12 min-w-12">
          <Search className="size-6" />
        </Button>
      </form>

      <ChannelVirtualList
        channels={
          query ? channels.filter((channel) => channel.name.toLowerCase().includes(query.toLowerCase())) : channels
        }
      ></ChannelVirtualList>
    </div>
  )
}

function ChannelVirtualList({ channels }: { channels: ChannelsSchema }) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const virtualizer = useWindowVirtualizer({
    count: channels.length,
    estimateSize: () => 48,
    overscan: 10,
    scrollMargin: containerRef.current?.offsetTop ?? 0,
  })

  return (
    <div ref={containerRef}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((item) => (
          <div
            key={item.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${item.size}px`,
              transform: `translateY(${item.start - virtualizer.options.scrollMargin}px)`,
            }}
          >
            {channels.at(item.index) ? <ChannelItem channel={channels.at(item.index)!}></ChannelItem> : null}
          </div>
        ))}
      </div>
    </div>
  )
}

function ChannelItem({ channel }: { channel: ChannelSchema }) {
  return (
    <div className="flex gap-4 items-center">
      <Button asChild>
        <Link href={`/channel/${channel.id}`} prefetch={false}>
          查看留言
        </Link>
      </Button>

      <div className="text-2xl font-bold py-2 truncate">{channel.name}</div>
    </div>
  )
}

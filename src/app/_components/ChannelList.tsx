'use client'

import { useQuery } from '@tanstack/react-query'
import { useWindowVirtualizer } from '@tanstack/react-virtual'
import { Search, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { useSearchTermContext } from '~/context'
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

  if (isLoading) return <div className="text-center">資料載入中...</div>

  if (error) {
    return (
      <div className="text-center">
        <p>資料載入時發生異常：</p>
        <p>{error.message}</p>
      </div>
    )
  }

  return allChannels ? <ChannelSearch channels={allChannels}></ChannelSearch> : null
}

function ChannelSearch({ channels }: { channels: ChannelsSchema }) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { searchTerm, setSearchTerm } = useSearchTermContext()

  const router = useRouter()

  useEffect(() => {
    const query = new URL(window.location.toString()).searchParams.get('query')

    setSearchTerm(query ?? '')
  }, [setSearchTerm])

  function updateSearchTerm(value: string) {
    setSearchTerm(value)

    if (inputRef.current) {
      inputRef.current.value = value
    }

    if (value) {
      router.push(`/?query=${encodeURIComponent(value)}`)
    } else {
      router.push(`/`)
    }
  }

  if (!channels?.filter || typeof channels.filter !== 'function') {
    return
  }

  return (
    <>
      <form
        className="flex gap-4 pb-8"
        onSubmit={(e) => {
          e.preventDefault()
          const value = inputRef.current?.value?.trim() ?? ''
          updateSearchTerm(value)
        }}
      >
        <Button type="submit" size="icon" className="size-12 min-w-12">
          <Search className="size-6" />
        </Button>

        <Input
          ref={inputRef}
          className="h-12 text-xl font-bold px-4"
          type="search"
          placeholder="搜尋名稱..."
          defaultValue={searchTerm}
          onKeyUp={(e) => {
            if (e.code === 'Enter') {
              const value = inputRef.current?.value ?? ''
              updateSearchTerm(value)
            }
          }}
        />

        {searchTerm ? (
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="size-12 min-w-12"
            onClick={() => updateSearchTerm('')}
          >
            <X className="size-6" />
          </Button>
        ) : null}
      </form>

      <ChannelVirtualList
        channels={
          searchTerm
            ? channels.filter((channel) => channel.name.toLowerCase().includes(searchTerm.toLowerCase()))
            : channels
        }
      ></ChannelVirtualList>
    </>
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
        <Link
          href={{
            pathname: `/channel/${channel.id}`,
          }}
          prefetch={false}
        >
          查看留言
        </Link>
      </Button>

      <div className="text-2xl font-bold py-2 truncate">{channel.name}</div>
    </div>
  )
}

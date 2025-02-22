'use client'

import { useQuery } from '@tanstack/react-query'
import { useWindowVirtualizer } from '@tanstack/react-virtual'
import { Search, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Channel } from '~/components/Channel'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { Skeleton } from '~/components/ui/skeleton'
import { useSearchTermContext } from '~/context'
import { type ChannelSchema, type ChannelsSchema, fetchChannelsData } from '~/query'

function random() {
  return Math.floor(Math.random() * 100) + 2
}

export function ChannelList() {
  const [skeletons, setSkeletons] = useState<number[]>([])

  // NOTE: use `useEffect()` to fix the "server prop did not match client prop" issue
  // credits: https://stackoverflow.com/a/66374800/9979122
  useEffect(() => {
    const initialSkeletions = Array.from(Array(20).keys()).map(() => random())

    setSkeletons(initialSkeletions)
  }, [])

  const {
    data: allChannels,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['channels'],
    queryFn: fetchChannelsData,
  })

  if (isLoading) {
    return (
      <>
        <div className="flex gap-4 pb-8">
          <Button type="button" size="icon" className="size-12 min-w-12">
            <Search className="size-6" />
          </Button>

          <Skeleton className="h-12 w-full" />
        </div>

        <div className="flex flex-col items-center gap-2">
          {skeletons.map((length, index) => {
            return (
              <div key={index} className="flex w-full items-center gap-4">
                <Skeleton className="h-10 min-w-[5.5rem] rounded-md" />
                <Skeleton className="h-8 rounded-none" style={{ width: `${length}ch` }} />
              </div>
            )
          })}
        </div>
      </>
    )
  }

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
  const { setSearchTerm } = useSearchTermContext()
  const inputRef = useRef<HTMLInputElement>(null)
  const searchParams = useSearchParams()
  const query = searchParams.get('query') ?? ''
  const router = useRouter()

  useEffect(() => {
    setSearchTerm(query)
  }, [setSearchTerm, query])

  function updateSearchTerm(value: string) {
    if (inputRef.current) {
      inputRef.current.value = value
    }

    if (value) {
      router.push(`/?query=${encodeURIComponent(value)}`, { scroll: false })
    } else {
      router.push(`/`, { scroll: false })
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
          className="h-12 px-4 text-xl font-bold"
          type="search"
          placeholder="搜尋名稱..."
          defaultValue={query}
          onKeyUp={(e) => {
            if (e.code === 'Enter') {
              const value = inputRef.current?.value ?? ''
              updateSearchTerm(value)
            }
          }}
          onCompositionEnd={() => {
            const value = inputRef.current?.value ?? ''
            updateSearchTerm(value)
          }}
        />

        {query ? (
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
          query ? channels.filter((channel) => channel.name.toLowerCase().includes(query.toLowerCase())) : channels
        }
      ></ChannelVirtualList>
    </>
  )
}

function ChannelVirtualList({ channels }: { channels: ChannelsSchema }) {
  const containerRef = useRef<HTMLDivElement>(null)

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
    <div className="flex items-center gap-4">
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

      <Popover>
        <PopoverTrigger asChild>
          <div className="w-full cursor-pointer truncate py-2 text-2xl font-bold">{channel.name}</div>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-screen max-w-[100vw] sm:w-fit sm:max-w-[calc(100vw-20px)]">
          <Channel channelId={channel.id} className="flex-col"></Channel>
        </PopoverContent>
      </Popover>
    </div>
  )
}

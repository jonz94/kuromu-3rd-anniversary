'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { fetchChannelsData } from '~/query'

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

  return (
    <table className="w-full border-separate border-spacing-2">
      <thead className="text-left text-3xl font-bold">
        <tr>
          <th>頻道網址</th>
          <th>頻道名稱</th>
          <th>查看留言</th>
        </tr>
      </thead>

      <tbody>
        {allChannels?.map((channel, index) => (
          <tr key={index}>
            <td className="text-xl">
              <a href={`https://www.youtube.com/channel/${channel.id}`} target="_blank" className="underline">
                {`https://www.youtube.com/channel/${channel.id}`}
              </a>
            </td>

            <td className="flex text-2xl items-center space-x-4">
              <span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/data/${channel.id}/avatar.jpg`}
                  width={160}
                  height={160}
                  className="size-16 rounded-full"
                  alt={`${channel.name} 的頻道頭像`}
                />
              </span>
              <span className="font-bold">{channel.name}</span>
            </td>

            <td>
              <Link href={`/channel/${channel.id}`} className="underline" target="_blank">
                查看留言
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

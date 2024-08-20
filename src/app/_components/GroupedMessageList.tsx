'use client'

import { useQuery } from '@tanstack/react-query'
import { default as groupBy } from 'just-group-by'
import { useMemo } from 'react'
import { fetchMessageData } from '~/query'

const channelId = 'UCCxllSJX8QT6YQQf79tzeTQ'

export function GroupedMessageList() {
  const {
    data: allMessages,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['messages', channelId],
    queryFn: fetchMessageData(channelId),
  })

  const groupedMessages = useMemo(() => groupBy(allMessages ?? [], (message) => message.videoId), [allMessages])
  const groups = useMemo(() => Object.keys(groupedMessages), [groupedMessages])
  const rows = useMemo(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
    () => groups.reduce<any[]>((acc, k) => [...acc, k, ...(groupedMessages[k] ?? [])], []),
    [groups, groupedMessages],
  )

  console.log(rows)

  if (isLoading) {
    return <>loading</>
  }

  if (error) {
    return (
      <div className="text-center">
        <p>資料載入時發生異常：</p>
        <p>{error.message}</p>
      </div>
    )
  }

  return <div>test</div>
}

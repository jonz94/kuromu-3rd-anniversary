'use client'

import { useQuery } from '@tanstack/react-query'
import { Text } from '~/app/_components/Text'
import { fetchMessage } from '~/query/message'

export function MessageList(props: { channelId: string }) {
  const {
    data: allRawTextMessages,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['messages', props.channelId],
    queryFn: fetchMessage(props.channelId),
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
          <th>留言時間</th>
          <th>原直播網址 (含時間軸)</th>
          <th>留言內容</th>
        </tr>
      </thead>

      <tbody>
        {allRawTextMessages?.map((textMessage, index) => (
          <tr key={index}>
            <td className="text-2xl">{new Date(textMessage.timestamp).toLocaleString('zh-Hant-TW')}</td>
            <td className="text-xl">
              <a
                href={`https://www.youtube.com/watch?v=${textMessage.videoId}&t=${Math.floor(Number(textMessage.videoOffsetTimeMsec) / 1000)}s`}
              >
                {`https://www.youtube.com/watch?v=${textMessage.videoId}&t=${Math.floor(Number(textMessage.videoOffsetTimeMsec) / 1000)}s`}
              </a>
            </td>
            <td className="flex col-span-2 text-2xl items-center">
              <Text text={textMessage.jsonMessage}></Text>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

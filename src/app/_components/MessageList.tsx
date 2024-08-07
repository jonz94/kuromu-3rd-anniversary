'use client'

import { useQuery } from '@tanstack/react-query'
import { MembershipItem } from '~/app/_components/MembershipItem'
import { PaidMessage } from '~/app/_components/PaidMessage'
import { PaidSticker } from '~/app/_components/PaidSticker'
import { SponsorshipsGiftPurchaseAnnouncement } from '~/app/_components/SponsorshipsGiftPurchaseAnnouncement'
import { SponsorshipsGiftRedemptionAnnouncement } from '~/app/_components/SponsorshipsGiftRedemptionAnnouncement'
import { Text } from '~/app/_components/Text'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import {
  fetchMessageData,
  type RawMembershipItemSchemaWithMessageType,
  type RawPaidMessageSchemaWithMessageType,
  type RawPaidStickerSchemaWithMessageType,
  type RawSponsorshipsGiftPurchaseAnnouncementSchemaWithMessageType,
  type RawSponsorshipsGiftRedemptionAnnouncementSchemaWithMessageType,
  type RawTextMessageSchemaWithMessageType,
} from '~/query'

export function MessageList({ channelId }: { channelId: string }) {
  const {
    data: allMessages,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['messages', channelId],
    queryFn: fetchMessageData(channelId),
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

  return (
    <table className="w-full border-separate border-spacing-2">
      <thead className="text-left text-3xl font-bold">
        <tr>
          <th className="hidden sm:table-cell">時間</th>
          <th className="hidden sm:table-cell">原直播網址 (含時間軸)</th>
          <th>內容</th>
        </tr>
      </thead>

      <tbody>
        {allMessages?.map((message, index) => {
          const timestamp = new Date(message.timestamp).toLocaleString('zh-Hant-TW')
          const url = `https://www.youtube.com/watch?v=${message.videoId}&t=${Math.floor(Number(message.videoOffsetTimeMsec) / 1000)}s`

          return (
            <tr key={index}>
              <td className="hidden text-2xl sm:table-cell">{timestamp}</td>
              <td className="hidden text-xl sm:table-cell">
                <a href={url} target="_blank" className="underline">
                  {url}
                </a>
              </td>

              <Popover>
                <PopoverTrigger asChild>
                  <td className="col-span-2 flex cursor-pointer items-center sm:cursor-auto">
                    {message.type === 'TextMessage' ? (
                      <Text text={(message as RawTextMessageSchemaWithMessageType).jsonMessage}></Text>
                    ) : null}
                    {message.type === 'PaidMessage' ? (
                      <PaidMessage paidMessage={message as RawPaidMessageSchemaWithMessageType}></PaidMessage>
                    ) : null}
                    {message.type === 'PaidSticker' ? (
                      <PaidSticker paidSticker={message as RawPaidStickerSchemaWithMessageType}></PaidSticker>
                    ) : null}
                    {message.type === 'MembershipItem' ? (
                      <MembershipItem
                        membershipItem={message as RawMembershipItemSchemaWithMessageType}
                      ></MembershipItem>
                    ) : null}
                    {message.type === 'SponsorshipsGiftPurchaseAnnouncement' ? (
                      <SponsorshipsGiftPurchaseAnnouncement
                        sponsorshipsGiftPurchaseAnnouncement={
                          message as RawSponsorshipsGiftPurchaseAnnouncementSchemaWithMessageType
                        }
                      ></SponsorshipsGiftPurchaseAnnouncement>
                    ) : null}
                    {message.type === 'SponsorshipsGiftRedemptionAnnouncement' ? (
                      <SponsorshipsGiftRedemptionAnnouncement
                        text={(message as RawSponsorshipsGiftRedemptionAnnouncementSchemaWithMessageType).jsonMessage}
                      ></SponsorshipsGiftRedemptionAnnouncement>
                    ) : null}
                  </td>
                </PopoverTrigger>

                <PopoverContent align="start" className="visible flex w-full flex-col gap-y-2 sm:invisible">
                  <div>時間: {timestamp}</div>
                  <div>
                    <div>原直播網址 (含時間軸)</div>
                    <div>
                      <a href={url} target="_blank" className="underline">
                        {url}
                      </a>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

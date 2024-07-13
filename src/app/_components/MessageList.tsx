'use client'

import { useQuery } from '@tanstack/react-query'
import { MembershipItem } from '~/app/_components/MembershipItem'
import { PaidMessage } from '~/app/_components/PaidMessage'
import { SponsorshipsGiftPurchaseAnnouncement } from '~/app/_components/SponsorshipsGiftPurchaseAnnouncement'
import { SponsorshipsGiftRedemptionAnnouncement } from '~/app/_components/SponsorshipsGiftRedemptionAnnouncement'
import { Text } from '~/app/_components/Text'
import {
  fetchMessageData,
  type RawMembershipItemSchemaWithMessageType,
  type RawPaidMessageSchemaWithMessageType,
  type RawSponsorshipsGiftPurchaseAnnouncementSchemaWithMessageType,
  type RawSponsorshipsGiftRedemptionAnnouncementSchemaWithMessageType,
  type RawTextMessageSchemaWithMessageType,
} from '~/query'

export function MessageList(props: { channelId: string }) {
  const {
    data: allMessages,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['messages', props.channelId],
    queryFn: fetchMessageData(props.channelId),
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
    <>
      <table className="w-full border-separate border-spacing-2">
        <thead className="text-left text-3xl font-bold">
          <tr>
            <th>時間</th>
            <th>原直播網址 (含時間軸)</th>
            <th>內容</th>
          </tr>
        </thead>

        <tbody>
          {allMessages?.map((message, index) => (
            <tr key={index}>
              <td className="text-2xl">{new Date(message.timestamp).toLocaleString('zh-Hant-TW')}</td>
              <td className="text-xl">
                <a
                  href={`https://www.youtube.com/watch?v=${message.videoId}&t=${Math.floor(Number(message.videoOffsetTimeMsec) / 1000)}s`}
                  target="_blank"
                  className="underline"
                >
                  {`https://www.youtube.com/watch?v=${message.videoId}&t=${Math.floor(Number(message.videoOffsetTimeMsec) / 1000)}s`}
                </a>
              </td>
              <td className="flex col-span-2 items-center">
                {message.type === 'TextMessage' ? (
                  <Text text={(message as RawTextMessageSchemaWithMessageType).jsonMessage}></Text>
                ) : null}
                {message.type === 'PaidMessage' ? (
                  <PaidMessage paidMessage={message as RawPaidMessageSchemaWithMessageType}></PaidMessage>
                ) : null}
                {message.type === 'MembershipItem' ? (
                  <MembershipItem membershipItem={message as RawMembershipItemSchemaWithMessageType}></MembershipItem>
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
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

import { z } from 'zod'

const channelSchema = z.object({
  id: z.string(),
  name: z.string(),
})

export type ChannelSchema = z.infer<typeof channelSchema>

const channelsSchema = channelSchema.array()

export type ChannelsSchema = z.infer<typeof channelsSchema>

const rawTextMessageSchema = z.object({
  id: z.string(),
  userId: z.string(),
  videoId: z.string(),
  videoOffsetTimeMsec: z.string(),
  timestamp: z.number(),
  jsonMessage: z.string(),
})

const videoSchema = z.object({
  id: z.string(),
  title: z.string(),
  startTimestamp: z.string(),
  endTimestamp: z.string(),
  duration: z.number(),
})

export type VideoSchema = z.infer<typeof videoSchema>

const videosSchema = videoSchema.array()

export type VideosSchema = z.infer<typeof videosSchema>

export type MessageType =
  | 'TextMessage'
  | 'PaidMessage'
  | 'PaidSticker'
  | 'MembershipItem'
  | 'SponsorshipsGiftPurchaseAnnouncement'
  | 'SponsorshipsGiftRedemptionAnnouncement'

export type RawTextMessageSchema = z.infer<typeof rawTextMessageSchema>
export type RawTextMessageSchemaWithMessageType = RawTextMessageSchema & { type: MessageType }

const rawTextMessageListSchema = rawTextMessageSchema.array()

export type RawTextMessageListSchema = z.infer<typeof rawTextMessageListSchema>

const rawPaidMessageSchema = z.object({
  id: z.string(),
  userId: z.string(),
  videoId: z.string(),
  videoOffsetTimeMsec: z.string(),
  timestamp: z.number(),
  headerBackgroundColor: z.number(),
  headerTextColor: z.number(),
  bodyBackgroundColor: z.number(),
  bodyTextColor: z.number(),
  purchaseAmount: z.string(),
  jsonMessage: z.string(),
})

export type RawPaidMessageSchema = z.infer<typeof rawPaidMessageSchema>
export type RawPaidMessageSchemaWithMessageType = RawPaidMessageSchema & { type: MessageType }

const rawPaidMessageListSchema = rawPaidMessageSchema.array()

export type RawPaidMessageListSchema = z.infer<typeof rawPaidMessageListSchema>

const rawPaidStickerSchema = z.object({
  id: z.string(),
  userId: z.string(),
  videoId: z.string(),
  videoOffsetTimeMsec: z.string(),
  timestamp: z.number(),
  moneyChipBackgroundColor: z.number(),
  moneyChipTextColor: z.number(),
  backgroundColor: z.number(),
  authorNameTextColor: z.number(),
  purchaseAmount: z.string(),
  jsonSticker: z.string(),
})

export type RawPaidStickerSchema = z.infer<typeof rawPaidStickerSchema>
export type RawPaidStickerSchemaWithMessageType = RawPaidStickerSchema & { type: MessageType }

const rawPaidStickerListSchema = rawPaidStickerSchema.array()

export type RawPaidStickerListSchema = z.infer<typeof rawPaidStickerListSchema>

const rawMembershipItemSchema = z.object({
  id: z.string(),
  userId: z.string(),
  videoId: z.string(),
  videoOffsetTimeMsec: z.string(),
  timestamp: z.number(),
  headerPrimaryText: z.string(),
  headerSubtext: z.string(),
  jsonMessage: z.string(),
})

export type RawMembershipItemSchema = z.infer<typeof rawMembershipItemSchema>
export type RawMembershipItemSchemaWithMessageType = RawMembershipItemSchema & { type: MessageType }

const rawMembershipItemListSchema = rawMembershipItemSchema.array()

export type RawMembershipItemListSchema = z.infer<typeof rawMembershipItemListSchema>

const rawSponsorshipsGiftPurchaseAnnouncementSchema = z.object({
  id: z.string(),
  userId: z.string(),
  videoId: z.string(),
  videoOffsetTimeMsec: z.string(),
  timestampUsec: z.string(),
  headerPrimaryText: z.string(),
})

export type RawSponsorshipsGiftPurchaseAnnouncementSchema = z.infer<
  typeof rawSponsorshipsGiftPurchaseAnnouncementSchema
>
export type RawSponsorshipsGiftPurchaseAnnouncementSchemaWithMessageType =
  RawSponsorshipsGiftPurchaseAnnouncementSchema & { timestamp: number; type: MessageType }

const rawSponsorshipsGiftPurchaseAnnouncementListSchema = rawSponsorshipsGiftPurchaseAnnouncementSchema.array()

const rawSponsorshipsGiftRedemptionAnnouncementSchema = z.object({
  id: z.string(),
  userId: z.string(),
  videoId: z.string(),
  videoOffsetTimeMsec: z.string(),
  timestampUsec: z.string(),
  jsonMessage: z.string(),
})

export type RawSponsorshipsGiftRedemptionAnnouncementSchema = z.infer<
  typeof rawSponsorshipsGiftRedemptionAnnouncementSchema
>
export type RawSponsorshipsGiftRedemptionAnnouncementSchemaWithMessageType =
  RawSponsorshipsGiftRedemptionAnnouncementSchema & { timestamp: number; type: MessageType }

const rawSponsorshipsGiftRedemptionAnnouncementListSchema = rawSponsorshipsGiftRedemptionAnnouncementSchema.array()

export const fetchMessageData = (channelId: string) => {
  return async () => {
    const [
      allRawTextMessages,
      allRawPaidMessages,
      allRawPaidStickers,
      allRawMembershipItems,
      allRawSponsorshipsGiftPurchaseAnnouncements,
      allRawSponsorshipsGiftRedemptionAnnouncements,
    ] = await Promise.all([
      fetch(`/data/${channelId}/raw-text-messages.json`)
        .then((response) => response.text())
        .then((content) => rawTextMessageListSchema.parseAsync(JSON.parse(content))),

      fetch(`/data/${channelId}/raw-paid-messages.json`)
        .then((response) => response.text())
        .then((content) => rawPaidMessageListSchema.parseAsync(JSON.parse(content))),

      fetch(`/data/${channelId}/raw-paid-stickers.json`)
        .then((response) => response.text())
        .then((content) => rawPaidStickerListSchema.parseAsync(JSON.parse(content))),

      fetch(`/data/${channelId}/raw-membership-items.json`)
        .then((response) => response.text())
        .then((content) => rawMembershipItemListSchema.parseAsync(JSON.parse(content))),

      fetch(`/data/${channelId}/raw-live-chat-sponsorships-gift-purchase-announcement.json`)
        .then((response) => response.text())
        .then((content) => rawSponsorshipsGiftPurchaseAnnouncementListSchema.parseAsync(JSON.parse(content))),

      fetch(`/data/${channelId}/raw-live-chat-sponsorships-gift-redemption-announcements.json`)
        .then((response) => response.text())
        .then((content) => rawSponsorshipsGiftRedemptionAnnouncementListSchema.parseAsync(JSON.parse(content))),
    ])

    const allMessages: (
      | RawTextMessageSchemaWithMessageType
      | RawPaidMessageSchemaWithMessageType
      | RawPaidStickerSchemaWithMessageType
      | RawMembershipItemSchemaWithMessageType
      | RawSponsorshipsGiftPurchaseAnnouncementSchemaWithMessageType
      | RawSponsorshipsGiftRedemptionAnnouncementSchemaWithMessageType
    )[] = [
      ...allRawTextMessages.map((message) => ({ ...message, type: 'TextMessage' as MessageType })),
      ...allRawPaidMessages.map((message) => ({ ...message, type: 'PaidMessage' as MessageType })),
      ...allRawPaidStickers.map((message) => ({ ...message, type: 'PaidSticker' as MessageType })),
      ...allRawMembershipItems.map((message) => ({ ...message, type: 'MembershipItem' as MessageType })),
      ...allRawSponsorshipsGiftPurchaseAnnouncements.map((message) => ({
        ...message,
        timestamp: Number(message.timestampUsec.slice(0, -3)),
        type: 'SponsorshipsGiftPurchaseAnnouncement' as MessageType,
      })),
      ...allRawSponsorshipsGiftRedemptionAnnouncements.map((message) => ({
        ...message,
        timestamp: Number(message.timestampUsec.slice(0, -3)),
        type: 'SponsorshipsGiftRedemptionAnnouncement' as MessageType,
      })),
    ]

    return allMessages.toSorted((a, b) => new Date(a.timestamp).valueOf() - new Date(b.timestamp).valueOf())
  }
}

export const fetchChannelData = (channelId: string) => {
  return async (): Promise<ChannelSchema> => {
    const content = await fetch(`/data/${channelId}/channel.json`).then((response) => response.text())
    const parsedData = await channelSchema.parseAsync(JSON.parse(content))

    return parsedData
  }
}

export const fetchChannelsData = async (): Promise<ChannelsSchema> => {
  const content = await fetch(`/data/channels.json`).then((response) => response.text())
  const parsedData = await channelsSchema.parseAsync(JSON.parse(content))

  return parsedData
}

export const fetchPaidMessageData = (channelId: string) => {
  return async () => {
    const content = await fetch(`/data/${channelId}/raw-paid-messages.json`).then((response) => response.text())
    const parsedData = await rawPaidMessageSchema.parseAsync(JSON.parse(content))

    return parsedData
  }
}

export const fetchVideosData = async (): Promise<VideosSchema> => {
  const content = await fetch(`/data/videos.json`).then((response) => response.text())
  const parsedData = await videosSchema.parseAsync(JSON.parse(content))

  return parsedData
}

const countSchema = z.object({
  videosCountResult: z.number(),
  usersCountResult: z.number(),
  rawTextMessagesCountResult: z.number(),
  rawPaidMessagesCountResult: z.number(),
  rawPaidStickersCountResult: z.number(),
  rawMembershipItemsCountResult: z.number(),
  rawLiveChatSponsorshipsGiftPurchaseAnnouncementsCountResult: z.number(),
  rawLiveChatSponsorshipsGiftRedemptionAnnouncementsCountResult: z.number(),
  timestamp: z.string().datetime(),
})

export type CountSchema = z.infer<typeof countSchema>

export const fetchLastUpdatedAt = async () => {
  const content = await fetch(`/data/count.json`).then((response) => response.text())
  const parsedData = await countSchema.parseAsync(JSON.parse(content))

  return new Date(parsedData.timestamp)
}

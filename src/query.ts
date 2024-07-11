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

export type RawTextMessageSchema = z.infer<typeof rawTextMessageSchema>

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

const rawPaidMessageListSchema = rawPaidMessageSchema.array()

export type RawPaidMessageListSchema = z.infer<typeof rawPaidMessageListSchema>

export const fetchMessageData = (channelId: string) => {
  return async () => {
    return await Promise.all([
      fetch(`/data/${channelId}/raw-text-messages.json`)
        .then((response) => response.text())
        .then((content) => rawTextMessageListSchema.parseAsync(JSON.parse(content))),
      fetch(`/data/${channelId}/raw-paid-messages.json`)
        .then((response) => response.text())
        .then((content) => rawPaidMessageListSchema.parseAsync(JSON.parse(content))),
    ])
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

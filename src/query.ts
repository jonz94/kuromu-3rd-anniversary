import { z } from 'zod'

const channelSchema = z.object({
  id: z.string(),
  name: z.string(),
  thumbnailUrl: z.string(),
})

export type ChannelSchema = z.infer<typeof channelSchema>

const channelsSchema = channelSchema.array()

export type ChannelsSchema = z.infer<typeof channelsSchema>

const rawTextMessageSchema = z
  .object({
    id: z.string(),
    userId: z.string(),
    videoId: z.string(),
    videoOffsetTimeMsec: z.string(),
    timestamp: z.number(),
    jsonMessage: z.string(),
  })
  .array()

export type RawTextMessageSchema = z.infer<typeof rawTextMessageSchema>

export const fetchMessageData = (channelId: string) => {
  return async (): Promise<RawTextMessageSchema> => {
    const content = await fetch(`/data/${channelId}/raw-text-messages.json`).then((response) => response.text())
    const parsedData = await rawTextMessageSchema.parseAsync(JSON.parse(content))

    return parsedData
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

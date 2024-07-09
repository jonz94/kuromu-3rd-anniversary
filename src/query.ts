import { z } from 'zod'

const channelSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    thumbnailUrl: z.string(),
  })
  .array()

export type ChannelSchema = z.infer<typeof channelSchema>

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
    const response = await fetch(`/data/${channelId}/raw-text-messages.json`)
    const content = await response.text()
    const parsedMessage = await rawTextMessageSchema.parseAsync(JSON.parse(content))

    return parsedMessage
  }
}

export const fetchChannelData = async (): Promise<ChannelSchema> => {
  const response = await fetch(`/data/channels.json`)
  const content = await response.text()
  const parsedChannelData = await channelSchema.parseAsync(JSON.parse(content))

  return parsedChannelData
}

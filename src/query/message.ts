import { z } from 'zod'

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

export const fetchMessage = (channelId: string) => {
  return async (): Promise<RawTextMessageSchema> => {
    const response = await fetch(`/data/${channelId}/raw-text-messages.json`)
    const content = await response.text()
    const parsedMessage = await rawTextMessageSchema.parseAsync(JSON.parse(content))

    return parsedMessage
  }
}

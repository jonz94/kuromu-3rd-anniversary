'use client'

import { type RawPaidMessageSchemaWithMessageType } from '~/query'
import { convertARGB2rgbString } from '~/utils'

interface Image {
  url: string
  width: number
  height: number
}

interface Emoji {
  emoji_id: string
  image: Image[]
  is_custom: true
}

interface Run {
  text: string
  emoji?: Emoji
}

export interface TextJsonMessage {
  runs?: Run[]
  text: string
}

function findMaxImage(images: Image[]) {
  let maxImage: Image | null = null

  for (const image of images) {
    if (maxImage === null || maxImage.width < image.width) {
      maxImage = image
    }
  }

  return maxImage
}

function parseText(text?: string) {
  if (!text) {
    return null
  }

  const parsedText = JSON.parse(text) as TextJsonMessage

  if (!parsedText.runs) {
    return null
  }

  return (
    <>
      {parsedText.runs.map((run, index) => {
        if (run.emoji) {
          const maxImage = findMaxImage(run.emoji.image)

          return maxImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={index}
              src={maxImage.url}
              height={32}
              width={32}
              className="size-[32px] mx-0.5 align-middle inline"
              alt="emoji"
            />
          ) : null
        }

        return <>{run.text}</>
      })}
    </>
  )
}

export function PaidMessage({ paidMessage }: { paidMessage: RawPaidMessageSchemaWithMessageType }) {
  if (paidMessage.type !== 'PaidMessage') return null

  const text = parseText(paidMessage.jsonMessage)

  return (
    <div
      className="rounded-xl w-[360px]"
      style={{
        backgroundColor: convertARGB2rgbString(paidMessage.bodyBackgroundColor),
        color: convertARGB2rgbString(paidMessage.bodyTextColor),
      }}
    >
      <div className="px-4 py-2 min-h-12 flex items-center">{paidMessage.purchaseAmount}</div>
      {text ? (
        <div className="px-4 pb-2">
          <p>{text}</p>
        </div>
      ) : null}
    </div>
  )
}

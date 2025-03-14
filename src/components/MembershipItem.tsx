'use client'

import { type RawMembershipItemSchemaWithMessageType } from '~/query'

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
              className="mx-0.5 inline size-[32px] align-middle"
              alt=""
            />
          ) : null
        }

        return <>{run.text}</>
      })}
    </>
  )
}

export function MembershipItem({ membershipItem }: { membershipItem: RawMembershipItemSchemaWithMessageType }) {
  if (membershipItem.type !== 'MembershipItem') return null

  const text = parseText(membershipItem.jsonMessage)

  return (
    <div className="w-[360px] overflow-hidden rounded-sm">
      <div className="flex min-h-12 flex-col items-start justify-center bg-[rgb(10,128,67)] px-4 py-2">
        {membershipItem.headerPrimaryText !== 'N/A' ? (
          <p className="text-xl">
            {membershipItem.headerPrimaryText.replace('Member for', '已加入會員').replace(/months?/, '個月')}
          </p>
        ) : null}

        <p className={membershipItem.headerPrimaryText === 'N/A' ? 'text-xl' : 'text-lg text-white/70'}>
          {membershipItem.headerSubtext
            .replace('Welcome to', '歡迎加入')
            .replace('Upgraded membership to ', '頻道會員等級已升級至')
            .replace('!', '！')}
        </p>
      </div>
      {text ? (
        <div className="bg-[rgb(15,157,88)] px-4 py-2 text-xl">
          <p>{text}</p>
        </div>
      ) : null}
    </div>
  )
}

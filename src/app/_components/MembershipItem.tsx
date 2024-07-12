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

export function MembershipItem({ membershipItem }: { membershipItem: RawMembershipItemSchemaWithMessageType }) {
  if (membershipItem.type !== 'MembershipItem') return null

  const text = parseText(membershipItem.jsonMessage)

  return (
    <div className="rounded-sm w-[360px] overflow-hidden">
      <div className="px-4 py-2 min-h-12 flex flex-col items-start justify-center bg-[rgb(10,128,67)]">
        {membershipItem.headerPrimaryText !== 'N/A' ? (
          <p>
            {membershipItem.headerPrimaryText
              .replace('Member for', '已加入會員')
              .replace('months', '個月')
              .replace('month', '個月')}
          </p>
        ) : null}

        <p>{membershipItem.headerSubtext.replace('Welcome to', '歡迎加入').replace('!', '！')}</p>
      </div>
      {text ? (
        <div className="px-4 py-2 bg-[rgb(15,157,88)]">
          <p>{text}</p>
        </div>
      ) : null}
    </div>
  )
}

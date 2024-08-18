'use client'

import { type RawPaidStickerSchemaWithMessageType } from '~/query'
import { convertARGB2rgbString } from '~/utils'

interface Image {
  url: string
  width: number
  height: number
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

function parseSticker(text?: string) {
  if (!text) {
    return null
  }

  const parsedStickers = JSON.parse(text) as Image[]

  const image = findMaxImage(parsedStickers)

  return image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image.url}
      height={image.height}
      width={image.width}
      className="mx-0.5 inline size-20 align-middle"
      alt=""
    />
  ) : null
}

export function PaidSticker({ paidSticker }: { paidSticker: RawPaidStickerSchemaWithMessageType }) {
  if (paidSticker.type !== 'PaidSticker') return null

  const image = parseSticker(paidSticker.jsonSticker)

  return (
    <div
      className="flex w-[360px] justify-between rounded-xl px-4 py-2"
      style={{
        backgroundColor: convertARGB2rgbString(paidSticker.moneyChipBackgroundColor),
        color: convertARGB2rgbString(paidSticker.moneyChipTextColor),
      }}
    >
      <div className="flex items-center text-xl">{paidSticker.purchaseAmount}</div>
      <div>{image}</div>
    </div>
  )
}

'use client'

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
  endpoint?: {
    payload?: {
      url?: string
    }
  }
}

export interface TextJsonMessage {
  runs: Run[]
  text: string
}

function calculateRedirectUrlIfNeeded(originalUrl: string) {
  if (!originalUrl.startsWith('https://www.youtube.com/redirect')) {
    return originalUrl
  }

  try {
    const url = new URL(originalUrl)

    return url.searchParams.get('q')
  } catch (error) {
    console.error(`error when parsing ${originalUrl}`)
    console.error(error)

    return null
  }
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

        if (run.text === '□') {
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={index}
              src="/kuku-cry.png"
              height={32}
              width={32}
              className="mx-0.5 inline size-[32px] align-middle"
              alt=""
            />
          )
        }

        if (run?.endpoint?.payload?.url) {
          const url = calculateRedirectUrlIfNeeded(run.endpoint.payload.url)

          if (!url) {
            return run.text
          }

          return (
            <a href={url} key={index} target="_blank" rel="noopener noreferrer" className="underline">
              {url}
            </a>
          )
        }

        return run.text
      })}
    </>
  )
}

export function Text(props: { text?: string }) {
  const text = parseText(props.text)

  return <div className="text-2xl">{text}</div>
}

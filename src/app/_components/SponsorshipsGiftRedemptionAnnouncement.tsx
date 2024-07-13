'use client'

export interface TextJsonMessage {
  text: string
}

function parseText(text?: string) {
  if (!text) {
    return null
  }

  const parsedText = JSON.parse(text) as TextJsonMessage

  return `${parsedText.text.replace('was gifted a membership by', '獲得了')} 送出的會籍`
}

export function SponsorshipsGiftRedemptionAnnouncement(props: { text: string }) {
  const text = parseText(props.text)

  return (
    <div className="text-2xl text-white/70 italic flex">
      {text}
      <svg
        className="inline ml-1.5 relative -top-0.5"
        xmlns="http://www.w3.org/2000/svg"
        height="32"
        viewBox="0 0 24 24"
        width="32"
        focusable="false"
      >
        <path
          fill="currentColor"
          d="M19.28 3.61c-.96-.81-2.51-.81-3.47 0-.68.58-1.47 2.66-1.81 3.64-.34-.98-1.13-3.06-1.81-3.64-.96-.81-2.51-.81-3.47 0-.96.81-.96 2.13 0 2.94.62.53 2.7 1.12 3.94 1.45H5v6h8V8h2v6h4V8h-3.66c1.24-.32 3.32-.92 3.94-1.45.96-.81.96-2.13 0-2.94zM9.43 5.89c-.58-.43-.58-1.13 0-1.57.29-.21.67-.32 1.05-.32s.76.11 1.04.32c.39.29 1.02 1.57 1.48 2.68-1.48-.35-3.18-.82-3.57-1.11zm9.14 0c-.39.29-2.09.76-3.57 1.11.46-1.11 1.09-2.39 1.48-2.68.29-.21.67-.32 1.04-.32.38 0 .76.11 1.04.32.58.44.58 1.14.01 1.57zM5 16h8v5H5v-5zm10 0h4v5h-4v-5z"
        ></path>
      </svg>
    </div>
  )
}

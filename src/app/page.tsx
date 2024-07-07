import Image from 'next/image'
import Link from 'next/link'

import { Text } from '~/app/_components/text'
import { getServerAuthSession } from '~/server/auth'
import { api } from '~/trpc/server'

export default async function Home() {
  const session = await getServerAuthSession()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-8xl">留言紀錄</h1>

        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="justify-center text-4xl text-white flex gap-4 items-center">
              {session && (
                <>
                  <span>
                    <Image
                      src={session.user?.image ?? ''}
                      className="size-16 rounded-full"
                      width={160}
                      height={160}
                      alt=""
                    />
                  </span>
                  <span className="font-bold">{session.user?.name}</span>
                </>
              )}
            </div>
            <Link
              href={session ? '/api/auth/signout' : '/api/auth/signin'}
              className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
            >
              {session ? '登出' : '登入'}
            </Link>
          </div>
        </div>

        <AllTextMessages />
      </div>
    </main>
  )
}

async function AllTextMessages() {
  const session = await getServerAuthSession()
  if (!session?.user) return null

  const allRawTextMessages = await api.rawTextMessage.all()

  return allRawTextMessages && allRawTextMessages.length > 0 ? (
    <table className="w-full border-separate border-spacing-2">
      <thead className="text-left text-3xl font-bold">
        <tr>
          <th>留言時間</th>
          <th>原直播網址 (含時間軸)</th>
          <th>留言內容</th>
        </tr>
      </thead>

      <tbody>
        {allRawTextMessages && allRawTextMessages.length > 0
          ? allRawTextMessages.map((textMessage, index) => (
              <tr key={index}>
                <td className="text-2xl">{new Date(textMessage.timestamp).toLocaleString()}</td>
                <td className="text-xl">
                  <a
                    href={`https://www.youtube.com/watch?v=${textMessage.videoId}&t=${Math.floor(Number(textMessage.videoOffsetTimeMsec) / 1000)}s`}
                  >
                    {`https://www.youtube.com/watch?v=${textMessage.videoId}&t=${Math.floor(Number(textMessage.videoOffsetTimeMsec) / 1000)}s`}
                  </a>
                </td>
                <td className="flex col-span-2 text-2xl items-center">
                  <Text text={textMessage.jsonMessage}></Text>
                </td>
              </tr>
            ))
          : null}
      </tbody>
    </table>
  ) : (
    <div className="text-2xl">
      <p>查無任何紀錄</p>
    </div>
  )
}

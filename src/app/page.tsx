import Image from 'next/image'
import Link from 'next/link'
import { MessageList } from '~/app/_components/MessageList'
import { getServerAuthSession } from '~/server/auth'
import { api } from '~/trpc/server'

export default async function Home() {
  const session = await getServerAuthSession()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-8xl">留言紀錄</h1>
        <p className="text-xl">資料更新於 2024 年 07 月 06 日</p>

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

  const account = await api.account.getAccount()
  const channelId = account?.providerAccountId

  if (!channelId) return <h1>此帳號沒有任何紀錄</h1>

  return <MessageList channelId={channelId} />
}

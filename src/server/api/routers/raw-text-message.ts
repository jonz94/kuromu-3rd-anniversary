import { and, eq, sql } from 'drizzle-orm'

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { accounts, rawTextMessages } from '~/server/db/schema'

export const rawTextMessageRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db
      .select({
        id: rawTextMessages.id,
        userId: rawTextMessages.userId,
        videoId: rawTextMessages.videoId,
        videoOffsetTimeMsec: rawTextMessages.videoOffsetTimeMsec,
        timestamp: rawTextMessages.timestamp,
        jsonMessage: sql<string>`${rawTextMessages.jsonMessage}`,
      })
      .from(rawTextMessages)
      .leftJoin(accounts, eq(rawTextMessages.userId, accounts.providerAccountId))
      .where(and(eq(accounts.provider, 'youtube'), eq(accounts.userId, ctx.session.user.id)))
  }),
})

import { and, eq } from 'drizzle-orm'

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { accounts } from '~/server/db/schema'

export const accountRouter = createTRPCRouter({
  getAccount: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.accounts.findFirst({
      where: and(eq(accounts.provider, 'youtube'), eq(accounts.userId, ctx.session.user.id)),
    })
  }),
})

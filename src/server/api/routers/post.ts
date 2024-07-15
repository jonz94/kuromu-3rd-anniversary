import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'

const post = {
  id: 1,
  name: 'Hello World',
}

export const postRouter = createTRPCRouter({
  hello: publicProcedure.input(z.object({ text: z.string() })).query(({ input }) => {
    return {
      greeting: `Hello ${input.text}`,
    }
  }),

  getLatest: publicProcedure.query(() => {
    return post
  }),
})

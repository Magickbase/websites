import { z } from 'zod'
import { incrPostViewCount, isKVConfigured } from '../../../utils/kv'
import { createTRPCRouter, publicProcedure } from '../trpc'

export const postsRouter = createTRPCRouter({
  visit: publicProcedure.input(z.object({ postKey: z.string() })).query(async ({ input }) => {
    // TODO: Here, we should strictly verify whether postKey exists. Currently, only a simple restriction is implemented.
    if (input.postKey.length > 20) {
      throw new Error('Invalid post key')
    }

    return isKVConfigured() ? incrPostViewCount(input.postKey) : 0
  }),
})

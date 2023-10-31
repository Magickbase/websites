/**
 * There is no practical use for it at the moment, it's just reserved to make it easier to create api's in the future.
 */
import { createTRPCRouter } from './trpc'
import { uptimeRouter } from './routers/uptime'
import { postsRouter } from './routers/posts'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  uptime: uptimeRouter,
  posts: postsRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter

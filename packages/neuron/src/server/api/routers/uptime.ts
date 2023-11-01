import { createTRPCRouter, publicProcedure } from '../trpc'

export const uptimeRouter = createTRPCRouter({
  // TODO: need cache?
  aggregateState: publicProcedure.query(async () => {
    const resp = await fetch('https://betteruptime.com/api/v2/status-pages', {
      headers: {
        Authorization: `Bearer ${'1HkYYawwoVXDsVJNwpFZaKkE'}`,
      },
    })
    // response type by https://betterstack.com/docs/uptime/api/status-pages-api-response-params/
    const respData = (await resp.json()) as {
      data: {
        attributes: {
          aggregate_state: 'operational' | 'downtime' | 'degraded'
        }
      }[]
    }

    // This try-catch is just for preventing unexpected situations, and not targeting any specific problem.
    try {
      return respData.data[0]?.attributes.aggregate_state ?? 'unknown'
    } catch {
      return 'unknown'
    }
  }),
})

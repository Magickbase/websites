import { z } from 'zod'
import { UPTIME_KEY } from '../../../utils'
import { createTRPCRouter, publicProcedure } from '../trpc'
import type { StatusPageResponse, StatusResourceResponse, StatusSection, StatusIncident } from '../../../types'

export const uptimeRouter = createTRPCRouter({
  // TODO: need cache?
  aggregateState: publicProcedure.query(async () => {
    const resp = await fetch('https://betteruptime.com/api/v2/status-pages', {
      headers: {
        Authorization: `Bearer ${UPTIME_KEY}`,
      },
    })
    const respData = (await resp.json()) as {
      data: StatusPageResponse[]
    }

    // This try-catch is just for preventing unexpected situations, and not targeting any specific problem.
    try {
      return respData.data[0]?.attributes.aggregate_state ?? 'unknown'
    } catch {
      return 'unknown'
    }
  }),
  listStatusPageResources: publicProcedure.query(async () => {
    const resp = await fetch('https://betteruptime.com/api/v2/status-pages', {
      headers: {
        Authorization: `Bearer ${UPTIME_KEY}`,
      },
    })
    const status = (await resp.json()) as {
      data: StatusPageResponse[]
    }
    const id = status.data[0]?.id

    if (!id) throw new Error('No status page found')

    const res = await fetch(`https://betteruptime.com/api/v2/status-pages/${id}/resources`, {
      headers: {
        Authorization: `Bearer ${UPTIME_KEY}`,
      },
    })
    const resData = (await res.json()) as {
      data: StatusResourceResponse[]
    }

    return resData.data
  }),

  listStatusPageSections: publicProcedure.query(async () => {
    const resp = await fetch('https://betteruptime.com/api/v2/status-pages', {
      headers: {
        Authorization: `Bearer ${UPTIME_KEY}`,
      },
    })
    const status = (await resp.json()) as {
      data: StatusPageResponse[]
    }
    const id = status.data[0]?.id

    if (!id) throw new Error('No status page found')

    const res = await fetch(`https://betteruptime.com/api/v2/status-pages/${id}/sections`, {
      headers: {
        Authorization: `Bearer ${UPTIME_KEY}`,
      },
    })
    const resData = (await res.json()) as {
      data: StatusSection[]
    }

    return resData.data
  }),
  countIncidentPages: publicProcedure.query(async () => {
    const resp = await fetch(`https://uptime.betterstack.com/api/v2/incidents`, {
      headers: {
        Authorization: `Bearer ${UPTIME_KEY}`,
      },
    })

    const resData = (await resp.json()) as {
      data: StatusIncident[]
      pagination: {
        first: string,
        last: string,
        prev: string,
        next: string,
      }
    }

    if (!resData.pagination.last) return 1;

    const lastPage = Number(resData.pagination.last.split('=')[1]);
    return lastPage;
  }),
  listStatusIncidents: publicProcedure
    .input(
      z.object({
        page: z.number(),
      })
    )
    .query(async opts => {
      const resp = await fetch(`https://uptime.betterstack.com/api/v2/incidents?page=${opts.input.page}`, {
        headers: {
          Authorization: `Bearer ${UPTIME_KEY}`,
        },
      })

      const resData = (await resp.json()) as {
        data: StatusIncident[]
      }

      return resData.data
    }),
})

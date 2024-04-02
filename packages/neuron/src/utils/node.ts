import { NODE_INFO_API_ENDPOINT } from './env'

export type NodeInfo = {
  ckb_node_version: string
  current_block_height: number
  data_size_g: number
  data_size_m: number
  environment: string
  query_time: Date
}

export async function getNodeInfo(): Promise<NodeInfo | null> {
  try {
    const res = await fetch(NODE_INFO_API_ENDPOINT ?? 'https://ckb-node-info.magickbase.com/api', { method: 'GET' })
    const resData = (await res.json()) as NodeInfo

    return resData
  } catch (err) {
    return null
  }
}

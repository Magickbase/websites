import { Indexer } from '@ckb-lumos/ckb-indexer'
import { BI, helpers, Script, config, Cell, BIish } from '@ckb-lumos/lumos'
import { sealTransaction } from '@ckb-lumos/lumos/helpers'
import { CKB_MAINNET_NODE_URL, CKB_TESTNET_NODE_URL } from '../../../utils/constants'

export async function generateTxToRecycleSUDTCells(holder: string, sudtArgs: string, receiver: string) {
  const IS_MAINNET = holder.startsWith('ckb')
  const ENDPOINT = IS_MAINNET ? CKB_MAINNET_NODE_URL : CKB_TESTNET_NODE_URL
  const indexer = new Indexer(ENDPOINT)

  const CONFIG = IS_MAINNET ? config.predefined.LINA : config.predefined.AGGRON4

  const SUDT_CONFIG = CONFIG.SCRIPTS.SUDT
  const SUDT_CELL_DEP = {
    outPoint: { txHash: SUDT_CONFIG.TX_HASH, index: SUDT_CONFIG.INDEX },
    depType: SUDT_CONFIG.DEP_TYPE,
  }

  const ANYONE_CAN_PAY_CONFIG = CONFIG.SCRIPTS.ANYONE_CAN_PAY
  const ANYONE_CAN_PAY_DEP = {
    outPoint: { txHash: ANYONE_CAN_PAY_CONFIG.TX_HASH, index: ANYONE_CAN_PAY_CONFIG.INDEX },
    depType: ANYONE_CAN_PAY_CONFIG.DEP_TYPE,
  }

  const lock: Script = helpers.parseAddress(holder, { config: CONFIG })
  const type: Script = {
    codeHash: SUDT_CONFIG.CODE_HASH,
    hashType: SUDT_CONFIG.HASH_TYPE,
    args: sudtArgs,
  }

  const receiverLock = helpers.parseAddress(receiver, { config: CONFIG })

  const cells: Array<Cell> = []

  const collector = indexer.collector({ type, lock })

  for await (const cell of collector.collect()) {
    cells.push(cell)
  }
  if (!cells.length) {
    throw new Error('No cells found')
  }

  const totalCKB = cells.reduce((acc, cur) => BI.from(cur.cellOutput.capacity).add(acc), BI.from(0))

  let txSkeleton = helpers.TransactionSkeleton()
  txSkeleton = txSkeleton.update('cellDeps', deps => deps.push(SUDT_CELL_DEP, ANYONE_CAN_PAY_DEP))

  txSkeleton = txSkeleton = txSkeleton = txSkeleton.update('inputs', inputs => inputs.push(...cells))

  const SIZE = 340 + 52 * cells.length // precomputed
  const fee = calculateFee(SIZE)

  const total = totalCKB.sub(fee).toHexString()

  txSkeleton = txSkeleton = txSkeleton.update('outputs', outputs => {
    const receiverCell: Cell = {
      cellOutput: {
        capacity: total,
        lock: receiverLock,
      },
      data: '0x',
    }
    return outputs.push(receiverCell)
  })

  const tx = sealTransaction(txSkeleton, [])
  return { tx, total }
}

function calculateFee(size: number, feeRate: BIish = 1200): BI {
  const ratio = BI.from(1000)
  const base = BI.from(size).mul(feeRate)
  const fee = base.div(ratio)

  if (fee.mul(ratio).lt(base)) {
    return fee.add(1)
  }
  return BI.from(fee)
}

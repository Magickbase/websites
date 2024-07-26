import { type Script, utils } from '@ckb-lumos/base'

const CKB_MAINNET_NODE_URL = 'https://mainnet.ckb.dev/rpc'
const CKB_TESTNET_NODE_URL = 'https://testnet.ckb.dev/rpc'

interface Transaction {
  hash: string
  outputs: {
    capacity: string
    lock: {
      code_hash: string
      hash_type: string
      args: string
    }
  }[]
}

interface JSONTx {
  inputs: {
    since: string
    previousOutput: {
      txHash: string
      index: string
    }
  }[]
  outputs: {
    capacity: string
    lock: {
      codeHash: string
      hashType: string
      args: string
    }
  }[]
}

function checkIsObject(obj: unknown): obj is object {
  return typeof obj === 'object' && obj !== null
}

const JSON_FORMAT_ERROR_TYPE = Symbol('json_format_error')
export class JSONFormatError extends Error {
  type = JSON_FORMAT_ERROR_TYPE
}

function checkIsTx(json: unknown): json is JSONTx {
  if (!checkIsObject(json)) throw new JSONFormatError('JSON format is incorrect')
  if (!('inputs' in json)) throw new JSONFormatError(`Tx doesn't have inputs field`)
  if (!('outputs' in json)) throw new JSONFormatError(`Tx doesn't have outputs field`)
  if (!Array.isArray(json.inputs)) throw new JSONFormatError(`The inputs field must be an array`)
  if (!Array.isArray(json.outputs)) throw new JSONFormatError(`The outputs field must be an array`)
  return true
}

export default async function exportTxToSign({ tx, nodeType }: { tx: unknown; nodeType: string }) {
  const ckbNodeUrl: string = nodeType === 'mainnet' ? CKB_MAINNET_NODE_URL : CKB_TESTNET_NODE_URL
  if (!checkIsTx(tx)) return
  const context = await fetch(ckbNodeUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(
      tx.inputs.map((input, idx) => ({
        id: idx,
        jsonrpc: '2.0',
        method: 'get_transaction',
        params: [input.previousOutput.txHash],
      })),
    ),
  })
    .then(res => res.json() as unknown as { result: { transaction: Transaction } }[])
    .then(txs => txs.map(tx => tx.result.transaction))
  const inputs = tx.inputs.map((input, idx) => {
    const tx = context.find(t => t?.hash === input.previousOutput.txHash)
    if (!tx) {
      throw new Error(`Failed to load input cell ${idx} from context`)
    }
    const output = tx.outputs[+input.previousOutput.index]
    if (!output) {
      throw new Error(`${input.previousOutput.txHash} does not has ${+input.previousOutput.index} output`)
    }
    const lockScript = {
      codeHash: output.lock.code_hash,
      hashType: output.lock.hash_type,
      args: output.lock.args,
    }
    return {
      capacity: output.capacity,
      lock: lockScript,
      lockHash: utils.computeScriptHash(lockScript as Script),
    }
  })
  const inputsCapacity = inputs.reduce((pre, cur) => pre + BigInt(cur.capacity), BigInt(0))
  const outputCapacity = tx.outputs.reduce((pre, cur) => pre + BigInt(cur.capacity), BigInt(0))
  return {
    transaction: {
      description: '',
      nervosDao: false,
      signatures: {},
      fee: (outputCapacity - inputsCapacity).toString(),
      ...tx,
      inputs,
    },
    context,
    type: 'Regular',
    status: 'Unsigned',
  }
}

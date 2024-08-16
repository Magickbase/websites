import { type Script, utils } from '@ckb-lumos/base'
import { CKB_MAINNET_NODE_URL, CKB_TESTNET_NODE_URL } from './constants'

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
  cellDeps: {
    outPoint: {
      txHash: string
      index: string
    }
    depType: string
  }[]
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

interface JSONTxFromCli {
  cell_deps: {
    out_point: {
      tx_hash: string
      index: string
    }
    dep_type: string
  }[]
  inputs: {
    since: string
    previous_output: {
      tx_hash: string
      index: string
    }
  }[]
  outputs: {
    capacity: string
    lock: {
      code_hash: string
      hash_type: string
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

function checkIsTx(json: unknown): json is JSONTx | JSONTxFromCli {
  if (!checkIsObject(json)) throw new JSONFormatError('JSON format is incorrect')
  if (!('inputs' in json)) throw new JSONFormatError(`Tx doesn't have inputs field`)
  if (!('outputs' in json)) throw new JSONFormatError(`Tx doesn't have outputs field`)
  if (!Array.isArray(json.inputs)) throw new JSONFormatError(`The inputs field must be an array`)
  if (!Array.isArray(json.outputs)) throw new JSONFormatError(`The outputs field must be an array`)
  return true
}

const deepCamelizeKeys = (item: unknown): unknown => {
  if (Array.isArray(item)) {
    return item.map((el: unknown) => deepCamelizeKeys(el))
  } else if (typeof item === 'function' || item !== Object(item)) {
    return item
  }
  return Object.fromEntries(
    Object.entries(item as Record<string, unknown>).map(([key, value]: [string, unknown]) => [
      key.replace(/([-_][a-z])/gi, c => c.toUpperCase().replace(/[-_]/g, '')),
      deepCamelizeKeys(value),
    ]),
  )
}

function isJSONTxFromCli(tx: JSONTxFromCli | JSONTx): tx is JSONTxFromCli {
  return !!tx.inputs[0] && 'previous_output' in tx.inputs[0]
}

export default async function exportTxToSign({ json, nodeType }: { json: unknown; nodeType: string }) {
  const ckbNodeUrl: string = nodeType === 'mainnet' ? CKB_MAINNET_NODE_URL : CKB_TESTNET_NODE_URL
  let tx
  if (checkIsObject(json) && 'transaction' in json) {
    tx = json.transaction
  } else {
    tx = json
  }
  if (!checkIsTx(tx)) return
  if (isJSONTxFromCli(tx)) {
    tx = deepCamelizeKeys(tx) as JSONTx
  }
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
      ...input,
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
      cellDeps: tx.cellDeps.map(v => ({
        ...v,
        depType: v.depType === 'dep_group' ? 'depGroup' : v.depType,
      })),
    },
    context,
    type: 'Regular',
    status: 'Unsigned',
  }
}

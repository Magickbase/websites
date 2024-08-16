import { useTranslation } from 'next-i18next'
import { useState } from 'react'
import { BI } from '@ckb-lumos/lumos'
import { Button } from '../../../components/Button'
import exportTxToSign from '../../../utils/export-tx-to-sign'
import { generateTxToRecycleSUDTCells } from './generate_tx'
import { downloadFile } from '../../../utils'
import styles from './index.module.scss'

export const RecycleCells = () => {
  const { t } = useTranslation('tools')
  const [isLoading, setIsLoading] = useState(false)
  const [overview, setOverview] = useState('')
  const [err, setErr] = useState('')

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.stopPropagation()
    e.preventDefault()
    setIsLoading(true)
    setOverview('')
    setErr('')

    const { holder: holderElm, sudt: sudtElm, receiver: receiverElm } = e.currentTarget

    if (
      !(holderElm instanceof HTMLInputElement) ||
      !(sudtElm instanceof HTMLInputElement) ||
      !(receiverElm instanceof HTMLInputElement)
    ) {
      return
    }

    const handle = async () => {
      try {
        const holder = holderElm.value
        const sudtArgs = sudtElm.value
        const receiver = receiverElm.value
        const { tx, total } = await generateTxToRecycleSUDTCells(holder, sudtArgs, receiver)
        setOverview(
          t('Generate_TX_to_recycle_sudt_cells', {
            total: BI.from(total)
              .div(10 ** 8)
              .toString(),
            cellCount: tx.inputs.length,
          }).toString(),
        )

        const nodeType = holder.startsWith('ckb') ? 'mainnet' : 'testnet'

        const formatedTx = await exportTxToSign({ json: tx, nodeType })

        const blob = new Blob([JSON.stringify(formatedTx, undefined, 2)])
        const filename = `tx_to_recycle_cells.json`
        downloadFile(blob, filename)
      } catch (e) {
        if (e instanceof Error) {
          setErr(e.message)
        }
      } finally {
        setIsLoading(false)
      }
    }
    void handle()
  }

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <div id="recycle_cells">{t('Recycle_SUDT_Cells')}</div>
      <div>{t('Recycle_SUDT_Cells_Tip')}</div>
      <fieldset>
        <label htmlFor="holder">{t('Holder_Address')}</label>
        <input id="holder" placeholder={t('Holder_Address')!} />
      </fieldset>
      <fieldset>
        <label htmlFor="sudt">{t('Args_of_SUDT')}</label>
        <input id="sudt" placeholder={t('Args_of_SUDT')!} />
      </fieldset>
      <fieldset>
        <label htmlFor="receiver">{t('Receiver_Address')}</label>
        <input id="receiver" placeholder={t('Receiver_Address')!} />
      </fieldset>
      {err ? <div className={styles.err}>{err}</div> : <div className={styles.overview}>{overview}</div>}
      <Button style={{ width: 144 }} disabled={isLoading} type="submit">
        {isLoading ? <div className={styles.loading} /> : t('Generate')}
      </Button>
    </form>
  )
}

export default RecycleCells

import { GetStaticProps, type NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ChangeEventHandler, DragEventHandler, useCallback, useRef, useState } from 'react'
import ImgNeuronLogo from './neuron-logo.png'
import ToolsIcon from './tools.png'
import UploadSvg from './upload.svg'
import FileSvg from './file.svg'
import RefreshSvg from './refresh.svg'
import DownloadSvg from './download.svg'
import CloseSvg from './close.svg'
import { Page } from '../../components/Page'
import styles from './index.module.scss'
import { Button } from '../../components/Button'
import exportTxToSign, { JSONFormatError } from '../../utils/export-tx-to-sign'

interface PageProps {}

const Download: NextPage<PageProps> = () => {
  const { t } = useTranslation('tools')
  const [selectedNodeType, setSelectedNodeType] = useState('mainnet')
  const [isProcess, setIsProcess] = useState(false)
  const [processFile, setProcessFile] = useState<File | undefined>()
  const [processedJSON, setProcessedJSON] = useState<object | undefined>()
  const [err, setErr] = useState<string | undefined>()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const onClearFile = useCallback((e: Event) => {
    e.stopPropagation()
    e.preventDefault()
    setProcessFile(undefined)
    setProcessedJSON(undefined)
    setErr(undefined)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }, [])
  const onDrag: DragEventHandler<HTMLLabelElement> = useCallback(
    e => {
      e.preventDefault()
      let file: File | null | undefined
      if (e.dataTransfer.items) {
        const firstJsonFile = [...e.dataTransfer.items].find(item => {
          if (item.kind === 'file') {
            const file = item.getAsFile()
            return file?.type === 'application/json'
          }
        })
        file = firstJsonFile?.getAsFile()
      } else if (e.dataTransfer.files) {
        file = [...e.dataTransfer.files].find(file => {
          return file?.type === 'application/json'
        })
      }
      if (file) {
        setProcessFile(file)
        setProcessedJSON(undefined)
        setErr(undefined)
      }
    },
    [setProcessFile],
  )
  const onChooseFile: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    const chooseFile = e.target.files?.item(0)
    if (chooseFile) {
      setProcessFile(chooseFile)
    }
  }, [])
  const onSelectNodeType: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    if (e.target.checked) {
      setSelectedNodeType(e.target.value)
      setProcessedJSON(undefined)
      setErr(undefined)
    }
  }, [])
  const onProcessFile = useCallback(() => {
    if (processFile) {
      setErr(undefined)
      setIsProcess(true)
      processFile
        .text()
        .then(res =>
          exportTxToSign({
            tx: JSON.parse(res),
            nodeType: selectedNodeType,
          }),
        )
        .then(res => {
          setProcessedJSON(res)
        })
        .catch((err: Error) => {
          if (err instanceof JSONFormatError) {
            setErr(t('Incorrect_JSON')!)
          } else {
            setErr(err.toString())
          }
        })
        .finally(() => {
          setIsProcess(false)
        })
    }
    return undefined
  }, [processFile, selectedNodeType, t])
  const onDownload = useCallback(() => {
    if (!processedJSON || !processFile) return
    const blob = new Blob([JSON.stringify(processedJSON, undefined, 2)])
    const filename = `${processFile.name.split('.')[0]}_new.json`
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    URL.revokeObjectURL(url)
    document.body.removeChild(link)
  }, [processFile, processedJSON])
  return (
    <Page className={styles.page}>
      <div className={styles.head}>
        <div>
          <div className={styles.logo}>
            <Image src={ImgNeuronLogo} alt="Neuron Logo" width={44} height={44} />
            Neuron
          </div>
          <div>{t('Tools')}</div>
        </div>
        <Image src={ToolsIcon} alt="Tools" width={230} height={230} />
      </div>
      <div className={styles.body}>
        <div>{t('Raw_Transaction_Conversion')}</div>
        <div>{t('Raw_Transaction_Conversion_Tip')}</div>
        <label className={styles.upload} onDrop={onDrag} onDragOver={onDrag}>
          <input type="file" accept=".json" onChange={onChooseFile} ref={inputRef} />
          {processFile ? (
            <>
              <CloseSvg className={styles.clear} onClick={onClearFile} />
              <div className={styles.file}>
                <FileSvg />
                {processFile.name}
              </div>
            </>
          ) : (
            <>
              <UploadSvg />
              {t('Click_Or_Drag_To_Upload')}
            </>
          )}
        </label>
        <div className={styles.node}>
          <label>
            <input type="radio" value="mainnet" checked={selectedNodeType === 'mainnet'} onChange={onSelectNodeType} />
            {t('Mainnet')}
          </label>
          <label>
            <input type="radio" value="testnet" checked={selectedNodeType === 'testnet'} onChange={onSelectNodeType} />
            {t('Testnet')}
          </label>
        </div>
        {err ? <div className={styles.err}>{err}</div> : undefined}
        {processedJSON ? <div className={styles.success}>{t('Transaction_Complete')}</div> : null}
        <Button
          className={styles.process}
          disabled={!processFile || isProcess}
          onClick={processedJSON ? onDownload : onProcessFile}
        >
          {processedJSON ? (
            <>
              {t('Download')}
              <DownloadSvg />
            </>
          ) : (
            t(isProcess ? 'Processing' : 'Process')
          )}
          {isProcess ? <RefreshSvg /> : null}
        </Button>
      </div>
    </Page>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  const lng = await serverSideTranslations(locale, ['common', 'tools'])

  const props: PageProps = {
    ...lng,
  }

  return { props }
}

export default Download

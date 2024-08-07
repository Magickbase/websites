import { useState, type ComponentProps, type FC } from 'react'
import classnames from 'classnames'
import Spline from '@splinetool/react-spline'
import { useCopyToClipboard } from '@uidotdev/usehooks'
import { useTranslation } from 'next-i18next'
import { Modal } from '@/components/Modal'
import { Tooltip } from '@/components/Tooltip'
import toast from 'react-hot-toast'
import { isMobile } from 'react-device-detect'
import styles from './styles.module.scss'
import leftElement from './leftElement.png'
import rightElement from './rightElement.png'
import CopySvg from './copy.svg'
import CopySimpleSvg from './copySimple.svg'
import DoneSvg from './done.svg'
import MoreSvg from './more.svg'
import bgImage from './bg.png'

export const ContactUs: FC<ComponentProps<'div'>> = ({ className, ...props }) => {
  const { t } = useTranslation('common')
  const [copiedText, copyToClipboard] = useCopyToClipboard()
  const [copiedModalOpen, setCopiedModalOpen] = useState(false)

  const copy = () => {
    void copyToClipboard('neuron@magickbase.com')
    toast.success(`${t('copied')}!`)
  }

  return (
    <div className={classnames(`relative overflow-hidden`, className)} {...props}>
      <div
        className={classnames(styles.background, 'bg-center bg-cover')}
        style={{ backgroundImage: `url(${bgImage.src})` }}
      >
        <div
          className={classnames(styles.motion, 'absolute left-0 bottom-16', `w-[100px] h-[169px]`)}
          style={{ backgroundImage: `url(${leftElement.src})` }}
        />
        <div
          className={classnames(styles.motion, styles.reverse, 'absolute right-0 top-20', `w-[62px] h-[157px]`)}
          style={{ backgroundImage: `url(${rightElement.src})` }}
        />
      </div>
      <div className="container mx-auto py-16 md:py-32">
        <div className="flex flex-col md:flex-row items-center justify-center">
          <div className="h-48 w-48 mb-12 md:mb-0 md:h-80 md:w-80 md:mr-16">
            <Spline
              className={classnames('flex items-start justify-center', styles.splineWrapper)}
              scene="https://prod.spline.design/zLWBh10boGPlA9k1/scene.splinecode"
            />
          </div>

          <div className="flex flex-col flex-1 z-[2] items-center md:items-start md:max-w-[50%]">
            <h1 className="text-3xl mb-6 md:mb-8">{t('contact_us')}</h1>
            <p className="text-xl mb-8 text-[#999999] leading-8 text-center md:text-start">{t('contact_des')}</p>
            {isMobile ? (
              <button
                className="border-[1px] border-solid border-white rounded-xl py-4 px-6"
                onClick={() => setCopiedModalOpen(true)}
              >
                {t('contact_now')}
              </button>
            ) : (
              <Tooltip
                content={
                  <div className="flex items-center">
                    neuron@magickbase.com{' '}
                    {copiedText === 'neuron@magickbase.com' ? (
                      <DoneSvg className="ml-2" />
                    ) : (
                      <CopySimpleSvg className="ml-2 cursor-pointer" onClick={() => copy()} />
                    )}
                  </div>
                }
              >
                <div className="border-[1px] border-solid border-white rounded-xl py-4 px-6">{t('contact_now')}</div>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
      <Modal open={copiedModalOpen} dismiss={() => setCopiedModalOpen(false)}>
        <div className="modal-box sm:w-full md:!max-w-[520px]">
          <h1 className="text-xl font-bold mb-4">{t('create_email')}</h1>
          <div
            className="flex items-center rounded-lg p-4 bg-[#222]"
            onClick={() => {
              setCopiedModalOpen(false)
              copy()
            }}
          >
            <CopySvg className="mr-4" />
            <div>
              <div className="text-[#f5f5f5]">{t('copy_email')}</div>
              <div className="text-[#999]">neuron@magickbase.com</div>
            </div>
            <MoreSvg className="ml-auto" />
          </div>
        </div>
      </Modal>
    </div>
  )
}

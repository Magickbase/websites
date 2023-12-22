import { useState, type ComponentProps, type FC } from 'react'
import classnames from 'classnames'
import Spline from '@splinetool/react-spline'
import { useCopyToClipboard } from '@uidotdev/usehooks'
import { Modal, ModalProps } from '@/components/Modal'
import styles from './styles.module.scss'
import leftElement from './leftElement.png'
import rightElement from './rightElement.png'
import CopySvg from './copy.svg'
import MoreSvg from './more.svg'
import bgImage from './bg.png'
import toast from 'react-hot-toast'
import { useIsMobile } from '@/hooks'

export const ContactUs: FC<ComponentProps<'div'>> = ({ className, ...props }) => {
  const [copiedText, copyToClipboard] = useCopyToClipboard()
  const [copiedModalOpen, setCopiedModalOpen] = useState(false)
  const isMobile = useIsMobile()

  const copy = () => {
    copyToClipboard('neuron@magickbase.com')
    toast.success('copied!')
  }

  return (
    <div className={classnames(`relative overflow-hidden`, className)} {...props}>
      <div
        className={classnames(styles.background, 'bg-center bg-cover')}
        style={{ backgroundImage: `url(${bgImage.src})` }}
      >
        <div
          className={classnames('absolute left-0 bottom-16', `w-[100px] h-[169px]`)}
          style={{ backgroundImage: `url(${leftElement.src})` }}
        />
        <div
          className={classnames('absolute right-0 top-20', `w-[62px] h-[157px]`)}
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

          <div className="flex flex-col flex-1 z-10 items-center md:items-start md:max-w-[50%]">
            <h1 className="text-3xl mb-6 md:mb-8">Contact us</h1>
            <p className="text-xl mb-8 text-[#999999] leading-8 text-center md:text-start">
              Magickbase consistently adheres to the spirit of open source mutual benefit, and welcomes users to
              participate in the construction of the product and learn from each other to grow together.
            </p>
            {isMobile ? (
              <button
                className="border-[1px] border-solid border-white rounded-xl py-4 px-6"
                onClick={() => setCopiedModalOpen(true)}
              >
                Contact Now
              </button>
            ) : (
              <div
                className={classnames(
                  'tooltip after:top-[-14px] after:z-10 after:border-t-[#333] after:border-[8px]',
                  'before:bottom-[72px] before:text-base before:p-4 before:shadow-md before:shadow-[#ffffff4d]',
                )}
                data-tip="neuron@magickbase.com"
              >
                <button className="border-[1px] border-solid border-white rounded-xl py-4 px-6" onClick={() => copy()}>
                  Contact Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Modal open={copiedModalOpen} dismiss={() => setCopiedModalOpen(false)}>
        <div className="modal-box sm:w-full md:!max-w-[520px]">
          <h1 className="text-xl font-bold mb-4">Create an email using the following application:</h1>
          <div
            className="flex items-center rounded-lg p-4 bg-[#222]"
            onClick={() => {
              setCopiedModalOpen(false)
              copy()
            }}
          >
            <CopySvg className="mr-4" />
            <div>
              <div className="text-[#f5f5f5]">Copy Email</div>
              <div className="text-[#999]">neuron@magickbase.com</div>
            </div>
            <MoreSvg className="ml-auto" />
          </div>
        </div>
      </Modal>
    </div>
  )
}

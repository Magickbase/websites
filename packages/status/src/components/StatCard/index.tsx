import { ComponentProps, useState } from 'react'
import classNames from 'classnames'
import { Modal } from '@/components/Modal'
import ArrowsOutSimpleIcon from './ArrowsOutSimple.svg'
import ArrowsInSimpleIcon from './ArrowsInSimple.svg'

export const StatCard = ({ title, className, ...props }: ComponentProps<'div'> & { title: string }) => {
  const [zoom, setZoom] = useState(false)
  const [firstOpen, setFirstOpen] = useState(false)

  return (
    <>
      <div
        className={classNames(
          'border border-[#FFFFFF33] border-solid rounded-3xl p-4 bg-gradient-to-b from-[#36363666] to-[#1D1D1D33]',
          className,
        )}
        {...props}
      >
        <div className="flex items-center mb-2">
          {title}
          <ArrowsOutSimpleIcon
            className="ml-auto cursor-pointer"
            onClick={() => {
              setZoom(true)
              setFirstOpen(true)
            }}
          />
        </div>
        <div className="relative">{props.children}</div>
      </div>
      {firstOpen && (
        <Modal open={zoom} dismiss={() => setZoom(false)}>
          <div className="w-full md:w-[80vw] h-[80vh] flex flex-col bg-[#111111] p-4 rounded-2xl">
            <div className="flex items-center mb-4">
              {title}
              <ArrowsInSimpleIcon className="ml-auto cursor-pointer" onClick={() => setZoom(false)} />
            </div>
            <div className="relative flex-1">{props.children}</div>
          </div>
        </Modal>
      )}
    </>
  )
}

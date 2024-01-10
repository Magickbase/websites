'use client'
import React from 'react'
import { type ToasterProps, Toaster, ToastIcon, resolveValue } from 'react-hot-toast'
import classnames from 'classnames'

export const TailwindToaster = (props: ToasterProps) => {
  return (
    <Toaster {...props}>
      {t => (
        <div className={classnames('transform py-4 px-12 flex rounded-full shadow-lg z-20', {
          ['bg-base-200']: t.type !== 'success',
          ['bg-[#00CC9B]']: t.type === 'success',
        })}>
          <p className="px-2 text-[#333333]">{resolveValue(t.message, t)}</p>
        </div>
      )}
    </Toaster>
  )
}

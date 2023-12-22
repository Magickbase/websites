'use client'
import React from 'react'
import {
  type ToasterProps,
  Toaster,
  ToastIcon,
  resolveValue,
} from 'react-hot-toast'

export const TailwindToaster = (props: ToasterProps) => {
  return (
    <Toaster {...props}>
      {(t) => (
        <div className="transform py-2 px-4 flex bg-base-200 rounded-lg shadow-lg z-20">
          <ToastIcon toast={t} />
          <p className="px-2">{resolveValue(t.message, t)}</p>
        </div>
      )}
    </Toaster>
  )
}

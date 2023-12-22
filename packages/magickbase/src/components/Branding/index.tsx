'use client'
import { useState, type ComponentProps, type FC, useEffect, useTransition } from 'react'
import classnames from 'classnames'
import Script from 'next/script'
import { useInView } from 'react-intersection-observer'
import placeHolder from './placeholder.png'

export const Branding: FC<ComponentProps<'div'>> = ({ className, ...props }) => {
  const { ref, inView } = useInView({ threshold: 0.5 })
  // const { t } = useTransition('common')

  useEffect(() => {
    if (inView) {
      window.dispatchEvent(new Event('playperlin'))
    } else {
      window.dispatchEvent(new Event('stopperlin'))
    }
  }, [inView])

  return (
    <>
      <Script
        src="/perlin.js"
        onLoad={() => {
          window.dispatchEvent(new Event('startperlin'))
        }}
      />
      <div
        className={classnames(`relative flex flex-col justify-center items-center text-center h-screen overflow-hidden`, className)}
        {...props}
      >
        <div className="container md:px-12">
          <h1 className="text-3xl font-bold leading-10 md:text-7xl mb-2">Building a future</h1>
          <h1 className="text-3xl font-bold leading-10 mb-6 md:text-7xl md:mb-9">without permission</h1>
          <p className="text-base leading-8 md:text-3xl">
            We&apos;re proud of the products we&apos;ve built, the communities we&apos;ve supported, and the impact
            we&apos;ve made on the world, leading the charge in the decentralized revolution.
          </p>
        </div>
        <div className="absolute w-screen h-screen z-[-2]">
          <div ref={ref} className="w-full h-full" id="perlin-container" />
          <div
            className="absolute top-0 bottom-0 left-0 right-0 z-[-1] bg-cover bg-no-repeat bg-center"
            style={{ backgroundImage: `url(${placeHolder.src})` }}
          />
        </div>

        {/* <div className="absolute left-0 top-0 right-0 bottom-0 z-[-1] bg-[#00000066]" /> */}
      </div>
    </>
  )
}

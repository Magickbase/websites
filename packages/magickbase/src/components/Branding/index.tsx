'use client'
import { type ComponentProps, type FC, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import classnames from 'classnames'
import Script from 'next/script'
import { useInView } from 'react-intersection-observer'
import placeHolder from './placeholder.png'

export const Branding: FC<ComponentProps<'div'>> = ({ className, ...props }) => {
  const { ref, inView } = useInView({ threshold: 0.5 })
  const { t } = useTranslation('common')

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
        className={classnames(
          `relative flex flex-col justify-center items-center text-center h-screen overflow-hidden`,
          className,
        )}
        {...props}
      >
        <div className="container md:px-12 z-[1]">
          <h1 className="text-3xl font-bold leading-10 md:text-7xl mb-2">{t('branding_title')}</h1>
          <p className="text-base leading-8 md:text-3xl">
            {t('branding_des')}
          </p>
        </div>
        <div className="absolute w-screen h-screen">
          <div ref={ref} className="w-full h-full" id="perlin-container" />
          <div
            className="absolute top-0 bottom-0 left-0 right-0 z-[-1] bg-cover bg-no-repeat bg-center"
            style={{ backgroundImage: `url(${placeHolder.src})` }}
          />
        </div>
      </div>
    </>
  )
}

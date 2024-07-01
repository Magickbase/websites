import type { FC, ComponentProps } from 'react'
import classnames from 'classnames'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import CkbExplorerLogo from './ckbExplorerLogo.png'
import GodwokenLogo from './godwokenLogo.svg'
import KuaiLogo from './kuaiLogo.svg'
import NeuronLogo from './neuronLogo.svg'
import UnknownLogo from './unknownLogo.svg'
import LumosLogo from './lumosLogo.svg'

interface ServiceItemProps extends ComponentProps<'div'> {
  title: string
  description: string
}

const ServiceItem: FC<ServiceItemProps> = ({ title, description, className, ...props }) => {
  return (
    <div
      className={classnames(
        'hover:scale-110 transition-all duration-200 select-none cursor-pointer',
        'text-center flex flex-col items-center gap-4 p-8 rounded-lg',
        'bg-gradient-to-b from-[#36363665] to-[#1d1d1d66]',
        'h-full border border-solid border-[#ffffff14]',
        className,
      )}
      {...props}
    >
      {props.children}
      <div className="text-[#f5f5f5] text-2xl mt-auto">{title}</div>
      <div className="text-[#f5f5f5]">{description}</div>
    </div>
  )
}

export const Services: FC<ComponentProps<'div'>> = ({ className, ...props }) => {
  const { locale = 'en' } = useRouter()
  const { t } = useTranslation('common')

  return (
    <div className={classnames('relative container mx-auto pt-24 pb-40', className)} {...props}>
      <div className="text-center text-3xl mb-16">{t('service')}</div>
      <div className="grid md:grid-cols-3 gap-12">
        <Link href={`https://neuron.magickbase.com/${locale}`}>
          <ServiceItem title="Neuron" description={t('neuron_des')}>
            <NeuronLogo />
          </ServiceItem>
        </Link>

        <Link href="https://explorer.nervos.org">
          <ServiceItem title="CKB Explorer" description={t('explorer_des')}>
            <Image src={CkbExplorerLogo} alt="CKB Explorer" width={132} height={44} />
          </ServiceItem>
        </Link>

        <Link href="https://v1.gwscan.com/">
          <ServiceItem title="Godwoken Explorer" description={t('godwoken_des')}>
            <GodwokenLogo />
          </ServiceItem>
        </Link>

        <Link href="https://github.com/Magickbase/blockscan">
          <ServiceItem title="Axon Explorer" description={t('axon_des')}>
            <UnknownLogo />
          </ServiceItem>
        </Link>

        <Link href="https://lumos-website.vercel.app/">
          <ServiceItem title="Lumos" description={t('lumos_des')}>
            <LumosLogo className="mt-4"/>
          </ServiceItem>
        </Link>

        <Link href="https://github.com/ckb-js/kuai">
          <ServiceItem title="Kuai" description={t('kuai_des')}>
            <KuaiLogo />
          </ServiceItem>
        </Link>
      </div>
    </div>
  )
}

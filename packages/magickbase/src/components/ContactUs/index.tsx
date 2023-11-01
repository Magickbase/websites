import type { FC } from 'react'
import classnames from 'classnames'
import logoPng from './logo.png'
import maskTopPng from './mask_top.png'
import maskBottomPng from './mask_bottom.png'

export const ContactUs: FC = () => (
  <div className={classnames(`relative`)}>
    <div className='absolute w-full h-full bg-right-top bg-no-repeat z-[-1]' style={{ backgroundImage: `url(${maskTopPng.src})` }} />
    <div className='absolute w-full h-full bg-left-bottom bg-no-repeat z-[-1]' style={{ backgroundImage: `url(${maskBottomPng.src})` }} />

    <div className="container mx-auto py-32">
      <div className="flex">
        <div className="h-96 flex-1 bg-contain bg-no-repeat bg-center" style={{ backgroundImage: `url(${logoPng.src})` }} />

        <div className="flex-1">
          <h1 className='text-3xl mb-8'>Contact us</h1>
          <p className='text-xl mb-8'>
            Magickbase consistently adheres to the spirit of open source mutual benefit, and welcomes users to
            participate in the construction of the product and learn from each other to grow together.
          </p>
          <button className='border-[1px] border-solid border-white rounded-xl py-4 px-6'>Contact Now</button>
        </div>
      </div>
    </div>
  </div>
)

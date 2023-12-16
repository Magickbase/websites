import type { ComponentProps, FC } from 'react'
import classnames from 'classnames'
import Spline from '@splinetool/react-spline'

export const ContactUs: FC<ComponentProps<'div'>> = ({ className, ...props }) => (
  <div className={classnames(`relative overflow-hidden`, className)} {...props}>
    <div className="container mx-auto py-32">
      <div className="flex">
        <div className="flex-1">
          <Spline
            className="flex items-start justify-center"
            scene="https://prod.spline.design/zLWBh10boGPlA9k1/scene.splinecode"
          />
        </div>

        <div className="flex-1 z-10">
          <h1 className="text-3xl mb-8">Contact us</h1>
          <p className="text-xl mb-8">
            Magickbase consistently adheres to the spirit of open source mutual benefit, and welcomes users to
            participate in the construction of the product and learn from each other to grow together.
          </p>
          <button className="border-[1px] border-solid border-white rounded-xl py-4 px-6">Contact Now</button>
        </div>
      </div>
    </div>
  </div>
)

import type { ComponentProps, FC } from 'react'
import classnames from 'classnames'
import Spline from '@splinetool/react-spline'
import styles from './styles.module.scss';

export const ContactUs: FC<ComponentProps<'div'>> = ({ className, ...props }) => (
  <div className={classnames(`relative overflow-hidden`, className)} {...props}>
    <div className="container mx-auto py-16 md:py-32">
      <div className="flex flex-col md:flex-row items-center justify-center">
        <div className="h-60 w-60 md:h-80 md:w-80 md:mr-16">
          <Spline
            className={classnames("flex items-start justify-center", styles.splineWrapper)}
            scene="https://prod.spline.design/zLWBh10boGPlA9k1/scene.splinecode"
          />
        </div>

        <div className="flex flex-col flex-1 z-10 items-center md:items-start md:max-w-[50%]">
          <h1 className="text-3xl mb-8">Contact us</h1>
          <p className="text-xl mb-8 text-center md:text-start">
            Magickbase consistently adheres to the spirit of open source mutual benefit, and welcomes users to
            participate in the construction of the product and learn from each other to grow together.
          </p>
          <button className="border-[1px] border-solid border-white rounded-xl py-4 px-6">Contact Now</button>
        </div>
      </div>
    </div>
  </div>
)

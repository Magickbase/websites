import type { FC } from 'react'
import classnames from 'classnames'

export const Branding: FC = () => (
  <div className={classnames(`relative flex flex-col justify-center items-center text-center h-screen`)}>
    <div className="container md:px-12">
      <h1 className="text-7xl mb-2">Building a future</h1>
      <h1 className="text-7xl mb-9">without permission</h1>
      <p className="text-3xl">
        We&apos;re proud of the products we&apos;ve built, the communities we&apos;ve supported, and the impact
        we&apos;ve made on the world, leading the charge in the decentralized revolution.
      </p>
    </div>
    <div className="absolute z-[-2]">
      <iframe className="w-screen h-screen" src={'/perlin-noise/index.html'} />
    </div>

    <div className="absolute left-0 top-0 right-0 bottom-0 z-[-1] bg-[#00000066]" />
  </div>
)

import type { FC } from 'react'
import classnames from 'classnames'

export const Branding: FC = () => (
  <div className={classnames(`relative flex flex-col justify-center items-center text-center h-screen`)}>
    <div className="container">
      <h1 className="text-7xl">Building a future</h1>
      <h1 className="text-7xl">without permission</h1>
      <p className="text-3xl">With a range of services such as Neuron Wallet, CKB Browser,</p>
      <p className="text-3xl">Godwoken Browser, Axon Browser and Kuai, we can easily participate in the Nervos network ecosystem.</p>
    </div>
    <div className="absolute z-[-2]">
      <iframe className="w-screen h-screen" src={'/perlin-noise/index.html'} />
    </div>

    <div className="absolute left-0 top-0 right-0 bottom-0 z-[-1] bg-[#00000066]"/>
  </div>
)

import type { FC } from 'react'
import classnames from 'classnames'
import neuronBg from './neuron_bg.png';
import MoreIcon from './more.svg';

export const Services: FC = () => (
  <div className='container mx-auto'>
    <div className='flex items-start aspect-video bg-contain bg-no-repeat bg-center' style={{ backgroundImage: `url(${neuronBg.src})` }}>

      <div className='backdrop-blur-xl border-[1px] border-[#ffffff66] rounded-3xl mt-32 mr-32 ml-auto w-[520px] px-10 py-12'>
        <h1 className='text-3xl font-bold'>Neuron</h1>
        <div className='flex items-center'>
          <div className='text-xl'>CKB desktop wallet</div>
          <button className='flex items-center ml-auto border-[1px] border-solid border-white rounded-xl py-4 px-6'>More <MoreIcon className='ml-2' /></button>
        </div>
      </div>
    </div>

    <div className='bg-gradient-to-b from-[#36363699] to-[#1D1D1D99] rounded-full flex justify-between px-4 py-6'>
      <div className='px-16'>Neuron</div>
      <div className='px-16'>CKB Explorer</div>
      <div className='px-16'>Godwoken Explorer</div>
      <div className='px-16'>Axon Explorer</div>
      <div className='px-16'>Kuai</div>
    </div>
  </div>
)

import type { FC } from 'react'
import classnames from 'classnames'
import Spline from '@splinetool/react-spline'
import styles from './styles.module.scss'

const timelineItms = [
  {
    title: 'Vision',
    description: (
      <p>
        Support the permissionless blockchains and to express the importance of non-permission to the community. From
        the beginning, we knew that the success of the decentralized revolution depended on making it accessible to
        everyone, and we set out to build the tools and infrastructure needed to make this a reality.
      </p>
    ),
  },
  {
    title: 'Mission',
    description: (
      <>
        <p>
          Build a robust set of products that make it easier than ever for developers to build on the Nervos network.
        </p>
        <p>
          Our desktop wallet, Neuron, has become the solution of choice for experienced investors and developers. Our
          development frameworks, including CKB Explorer, Godwoken Explorer, Axon Explorer, Lumos and Nexus, provide
          developers with the tools they need to build high-performance decentralized applications. accessible to
          everyone, and we set out to build the tools and infrastructure needed to make this a reality.
        </p>
      </>
    ),
  },
  {
    title: 'Future',
    description: (
      <>
        <p>
          We know that the decentralized revolution is just beginning, and we&apos;re committed to playing a key role in
          shaping its direction. With a focus on openness, transparency, and innovation, we believe that we can build a
          brighter, more decentralized future for everyone.
        </p>
        <p>
          At Magickbase, we believe in the power of community, collaboration, and inclusivity. We&apos;re a team of
          passionate developers who are committed to making a difference in the world, and we&apos;re always looking for ways
          to learn from each other and grow together.
        </p>
      </>
    ),
  },
]

export const AboutUs: FC = () => (
  <div className={classnames(`container mx-auto`)}>
    <h1 className="text-3xl pl-6 mb-16">About us</h1>
    <div className="flex">
      <div className={classnames(styles.timeline, 'flex-1')}>
        {timelineItms.map((item, index) => (
          <div key={index} className={styles.item}>
            <div className={styles.index}>{(index + 1).toString().padStart(2, "0")}</div>
            <h1>{item.title}</h1>
            {item.description}
          </div>
        ))}
      </div>

      <div className="min-h-[400px] min-w-[400px]">
        <Spline
          className={styles.splineWrapper}
          scene="https://prod.spline.design/5GlLJjUAkA5U3kVP/scene.splinecode"
          onLoad={app => {
            console.log(app)
          }}
        />
      </div>
    </div>
  </div>
)

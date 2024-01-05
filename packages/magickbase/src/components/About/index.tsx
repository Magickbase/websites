import {
  type PropsWithChildren,
  type ComponentProps,
  type FC,
  useRef,
  Suspense,
  lazy,
  useState,
  useEffect,
} from 'react'
import classnames from 'classnames'
import type { SPEObject } from '@splinetool/runtime'
import Spline from '@splinetool/react-spline'
import useSpring from 'react-use/lib/useSpring'
import { useInView, IntersectionOptions } from 'react-intersection-observer'
import styles from './styles.module.scss'
import placeHolder from './placeholder.png'
import vision from './vision.png'
import mission from './mission.png'
import future from './future.png'

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
    img: vision,
  },
  {
    title: 'Mission',
    description: (
      <>
        <p>
          Build a robust set of products that make it easier than ever for developers to build on the Nervos network.
        </p>
        <p>Our desktop wallet, Neuron, has become the solution of choice for experienced investors and developers.</p>
        <p>
          Our development frameworks, including CKB Explorer, Godwoken Explorer, Axon Explorer, Lumos and Kuai, provide
          developers with the tools they need to build high-performance decentralized applications.
        </p>
      </>
    ),
    img: mission,
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
          passionate developers who are committed to making a difference in the world, and we&apos;re always looking for
          ways to learn from each other and grow together.
        </p>
      </>
    ),
    img: future,
  },
]

interface TimelineItemProps extends ComponentProps<'div'> {
  intersectionOptions?: IntersectionOptions
}

export const TimelineItem: FC<PropsWithChildren<TimelineItemProps>> = ({
  children,
  className,
  intersectionOptions,
  ...props
}) => {
  const { ref, inView } = useInView({ threshold: 0.2, initialInView: true, ...intersectionOptions })

  return (
    <div
      ref={ref}
      className={classnames(styles.item, className, 'snap-always', {
        [styles.active ?? '']: inView,
      })}
      {...props}
    >
      {children}
    </div>
  )
}

interface AnimationProps {
  rotationX: number
}

const AboutUsAnimation: FC<AnimationProps> = ({ rotationX }) => {
  const rotationXValue = useSpring(rotationX, 0, 5)
  const [loaded, setLoaded] = useState(false)
  const splineObj = useRef<SPEObject>()

  useEffect(() => {
    if (!splineObj || !splineObj.current) return
    splineObj.current.rotation.x = rotationXValue
  }, [rotationXValue, splineObj])

  return (
    <>
      {!loaded && (
        <div
          className="h-full w-full z-[-2] absolute bg-no-repeat bg-center"
          style={{ backgroundImage: `url(${placeHolder.src})` }}
        />
      )}
      <Suspense fallback={<></>}>
        <Spline
          className={classnames('pointer-events-none', styles.splineWrapper)}
          scene="https://prod.spline.design/F0-DxpS2rOYrCSe2/scene.splinecode"
          onLoad={app => {
            splineObj.current = app.findObjectByName('旋转')
            setLoaded(true)
          }}
        />
      </Suspense>
    </>
  )
}

export const AboutUs: FC<ComponentProps<'div'>> = () => {
  const [rotationX, setRotationValue] = useState(-Math.PI)

  return (
    <div className={classnames(`container mx-auto`)}>
      <h1 className="text-3xl pl-6 mt-16 mb-8 md:mb-16 snap-always snap-start scroll-mt-24">About us</h1>
      <div className="flex flex-col md:flex-row">
        <div className={classnames(styles.timeline, 'flex-1 ml-3')}>
          {timelineItms.map((item, index) => (
            <TimelineItem
              className={classnames('min-h-[calc(100vh-4em)] [&>p]:mb-4 md:[&>p]:mb-8 mb-24', {
                ['snap-start scroll-mt-24']: index !== 0,
              })}
              key={index}
              intersectionOptions={{
                onChange: inView => {
                  if (!inView) {
                    return
                  }

                  setRotationValue(-Math.PI + index * Math.PI)
                },
              }}
            >
              <div className={styles.index}>{(index + 1).toString().padStart(2, '0')}</div>
              <h1>{item.title}</h1>
              {item.description}
              <div
                className="md:hidden w-full h-[280px] bg-no-repeat bg-center bg-contain"
                style={{ backgroundImage: `url(${item.img.src})` }}
              />
            </TimelineItem>
          ))}
        </div>
        <div
          className={classnames(
            'self-center h-40 w-40 right-0 sticky hidden bottom-4 md:block md:h-[440px] md:w-[440px] md:top-[calc(50vh-220px)]',
          )}
        >
          <AboutUsAnimation rotationX={rotationX} />
        </div>
      </div>
    </div>
  )
}

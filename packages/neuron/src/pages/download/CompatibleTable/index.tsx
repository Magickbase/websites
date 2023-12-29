import { ComponentProps, FC } from 'react'
import clsx from 'clsx'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
import { useIsMobile } from '@magickbase-website/shared'
import styles from './index.module.scss'
import { CompatibleData } from '../../../utils'
import IconRight from './right.svg'
import IconWrong from './wrong.svg'

type CompatibleTableProps = Pick<ComponentProps<'div'>, 'className'> & {
  compatibleData: CompatibleData
  wrapperClass?: string
}

export const CompatibleTable: FC<CompatibleTableProps> = props => {
  const isMobile = useIsMobile()
  return (
    <div className={props.wrapperClass}>
      {isMobile ? <CompatibleTable$Mobile {...props} /> : <CompatibleTable$Desktop {...props} />}
    </div>
  )
}

/**
 * It is difficult to achieve the following effect with a `table`, so we use `flex` to implement it:
 *
 * TH |      TH       |      TH       | TH
 * C1 | C2 | C3 | ... | C6 | C7 | ... | C10
 *    <- srcoll bar -> <- srcoll bar ->
 */
const CompatibleTable$Desktop: FC<
  CompatibleTableProps & {
    hideFullNodeColumn?: boolean
    hideLightClientNodeColumn?: boolean
  }
> = ({ compatibleData, hideFullNodeColumn, hideLightClientNodeColumn, ...elProps }) => {
  const { neuronVersions, fullVersions, lightVersions, compatible } = compatibleData

  return (
    <div {...elProps} className={clsx(styles.compatibleTable, elProps.className)}>
      <div className={styles.neuronVersions}>
        <div className={styles.cell} />
        <div className={styles.cell}>Neuron</div>
        {neuronVersions.map(ver => (
          <div key={ver} className={styles.cell}>
            {ver}
          </div>
        ))}
      </div>

      {!hideFullNodeColumn && (
        <div className={styles.nodeVerions}>
          <div className={clsx(styles.cell, styles.head)}>Full Node</div>
          <NodeCompatibleTable
            neuronVersions={neuronVersions}
            nodeVersions={fullVersions}
            isCompatible={(neuronVer, fullVer) => compatible[neuronVer]?.full.includes(fullVer) ?? false}
          />
        </div>
      )}

      {!hideLightClientNodeColumn && (
        <div className={styles.nodeVerions}>
          <div className={clsx(styles.cell, styles.head)}>Light Client Node</div>
          <NodeCompatibleTable
            neuronVersions={neuronVersions}
            nodeVersions={lightVersions}
            isCompatible={(neuronVer, lightVer) => compatible[neuronVer]?.light.includes(lightVer) ?? false}
          />
        </div>
      )}
    </div>
  )
}

const CompatibleTable$Mobile: FC<CompatibleTableProps> = props => {
  return (
    <>
      <CompatibleTable$Desktop
        {...props}
        className={clsx(styles.compatibleTableMobile, props.className)}
        hideLightClientNodeColumn
      />
      <CompatibleTable$Desktop
        {...props}
        className={clsx(styles.compatibleTableMobile, props.className)}
        hideFullNodeColumn
      />
    </>
  )
}

const NodeCompatibleTable: FC<{
  neuronVersions: string[]
  nodeVersions: string[]
  isCompatible: (neuronVersion: string, nodeVersion: string) => boolean
}> = ({ neuronVersions, nodeVersions, isCompatible }) => {
  return (
    <OverlayScrollbarsComponent
      className={styles.nodeCompatibleTableWrapper}
      options={{ scrollbars: { autoHide: 'never' } }}
    >
      <div className={styles.nodeCompatibleTable}>
        {nodeVersions.map(nodeVer => (
          <div key={nodeVer} className={styles.col}>
            <div className={styles.cell}>{nodeVer}</div>
            {neuronVersions.map(neuronVer => (
              <div key={neuronVer} className={styles.cell}>
                {isCompatible(neuronVer, nodeVer) ? <IconRight /> : <IconWrong />}
              </div>
            ))}
          </div>
        ))}
      </div>
    </OverlayScrollbarsComponent>
  )
}

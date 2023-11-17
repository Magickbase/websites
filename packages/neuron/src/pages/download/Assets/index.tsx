import { ComponentProps, FC } from 'react'
import clsx from 'clsx'
import Link from 'next/link'
import { Tooltip } from '../../../components/Tooltip'
import IconWindows from './windows.svg'
import IconMacOS from './macos.svg'
import IconLinux from './linux.svg'
import IconTips from './tips.svg'
import styles from './index.module.scss'
import { ParsedAsset } from '../../../utils'
import { useIsMobile } from '../../../hooks'
import { LinkWithEffect } from '../../../components/UpsideDownEffect'

type AssetsProps = Pick<ComponentProps<'table'> | ComponentProps<'ul'>, 'className'> & { assets: ParsedAsset[] }

export const Assets: FC<AssetsProps> = props => {
  const isMobile = useIsMobile()
  return isMobile ? <Assets$Mobile {...props} /> : <Assets$Desktop {...props} />
}

export const Assets$Desktop: FC<AssetsProps> = ({ assets, ...tableProps }) => {
  return (
    <table {...tableProps} className={clsx(styles.assets, tableProps.className)}>
      <thead>
        <tr className={clsx(styles.row, styles.head)}>
          <th>System</th>
          <th>Architecture</th>
          <th>Package Type</th>
          <th>
            <div className={styles.checksum}>
              Checksum
              <Tooltip
                content={
                  <>
                    After the download is complete, you can{' '}
                    <LinkWithEffect
                      className={styles.checksumLink}
                      href="/posts/issues/2827#how_to_verify_with_checksum_%3F"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      check the Checksum
                    </LinkWithEffect>{' '}
                    to ensure that the installation package has not been tampered with during the download process.
                  </>
                }
              >
                <IconTips />
              </Tooltip>
            </div>
          </th>
          <th>Operation</th>
        </tr>
      </thead>

      <tbody>
        {assets.map(asset => (
          <tr key={asset.os + asset.arch + asset.packageType} className={styles.row}>
            <td>
              <div className={styles.os}>
                {asset.os.toLowerCase() === 'windows' && <IconWindows />}
                {asset.os.toLowerCase() === 'macos' && <IconMacOS />}
                {asset.os.toLowerCase() === 'linux' && <IconLinux />}
                {asset.os}
              </div>
            </td>
            <td>{asset.arch}</td>
            <td>{asset.packageType}</td>
            <td className={styles.checksum}>{asset.checksum}</td>
            <td className={styles.operation}>
              <LinkWithEffect href={asset.packageLink} target="_blank" rel="noopener noreferrer">
                Download
              </LinkWithEffect>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export const Assets$Mobile: FC<AssetsProps> = ({ assets, ...ulProps }) => {
  return (
    <ul {...ulProps} className={clsx(styles.assetsMobile, ulProps.className)}>
      {assets.map(asset => (
        <li key={asset.os + asset.arch + asset.packageType} className={styles.asset}>
          <div>System</div>
          <div className={styles.os}>
            {asset.os.toLowerCase() === 'windows' && <IconWindows />}
            {asset.os.toLowerCase() === 'macos' && <IconMacOS />}
            {asset.os.toLowerCase() === 'linux' && <IconLinux />}
            {asset.os}
          </div>
          <div>Architecture</div>
          <div>{asset.arch}</div>
          <div>Package Type</div>
          <div>{asset.packageType}</div>
          <div>
            {/* TODO: needs to be replaced by popover, https://github.com/radix-ui/primitives/issues/955#issuecomment-961813799 */}
            <Tooltip
              className={styles.checksumTitle}
              content={
                <>
                  After the download is complete, you can{' '}
                  <LinkWithEffect
                    className={styles.checksumLink}
                    href="/posts/issues/2827#how_to_verify_with_checksum_%3F"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    check the Checksum
                  </LinkWithEffect>{' '}
                  to ensure that the installation package has not been tampered with during the download process.
                </>
              }
            >
              Checksum
              <IconTips />
            </Tooltip>
          </div>
          <div className={styles.checksum}>{asset.checksum}</div>
          <div>Operation</div>
          <div className={styles.operation}>
            <Link href={asset.packageLink} target="_blank" rel="noopener noreferrer">
              Download
            </Link>
          </div>
        </li>
      ))}
    </ul>
  )
}

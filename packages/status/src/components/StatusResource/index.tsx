import classnames from 'classnames'
import { ComponentProps, PropsWithChildren } from 'react'
import { StatusResourceResponse } from '@/types'
import toast from 'react-hot-toast'
import CopyIcon from './copy.svg'
import { Tooltip } from '@/components/Tooltip'
import { useCopyToClipboard } from '@uidotdev/usehooks'

export interface StatusResourceProps extends Omit<ComponentProps<'div'>, 'resource'> {
  link?: string
  resource: StatusResourceResponse
}

function parseDuration(duration: number) {
  let seconds = duration
  // calculate hours
  const hours = Math.floor(seconds / 3600) % 24
  seconds -= hours * 3600

  // calculate minutes
  const minutes = Math.floor(seconds / 60) % 60
  seconds -= minutes * 60

  return `${hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''} and ` : ''} ${minutes} minute${minutes > 1 ? 's' : ''}`
}

export const StatusResource: React.FC<StatusResourceProps> = ({ link, resource, ...props }) => {
  const [_, copyToClipboard] = useCopyToClipboard()
  const currentStatus = resource.attributes.status_history[resource.attributes.status_history.length - 1]
  return (
    <div {...props}>
      <div className="flex items-center mb-4">
        <span
          className={classnames('w-2 h-2 rounded-full mr-2', {
            ['bg-[#00CC9B]']: currentStatus?.status === 'operational',
            ['bg-[#F62A2A]']: currentStatus?.status === 'downtime',
            ['bg-[#F68C2A]']: currentStatus?.status === 'degraded',
          })}
        />
        <span className="text-xl font-[600] mr-4">{resource.attributes.public_name}</span>

        {link && (
          <div className="p-2 shadow-inner border border-solid rounded-md border-[#333333] flex items-center">
            <span className="pr-2 mr-2 border-r border-solid border-[#333333]">{link}</span>
            <CopyIcon
              className="cursor-pointer fill-white hover:fill-[#00CC9B] transition-all"
              onClick={() => {
                console.log('onclick')
                copyToClipboard(link)
                toast.success('copied!')
              }}
            />
          </div>
        )}

        <span className="text-[#00CC9B] ml-auto">
          {(resource.attributes.availability * 100).toPrecision(5)}% Normal
        </span>
      </div>

      <div className="h-12 w-full flex gap-[2px] rounded-tl-xl mb-2">
        {resource.attributes.status_history.map(history => (
          <Tooltip
            key={history.day}
            className="flex-1 first:rounded-tl-md first:rounded-bl-md last:rounded-tr-md last:rounded-br-md overflow-hidden"
            content={
              <div>
                <div className="flex items-center">
                  <span
                    className={classnames('w-2 h-2 rounded-full mr-2', {
                      ['bg-[#00CC9B]']: history.status === 'operational',
                      ['bg-[#F62A2A]']: history.status === 'downtime',
                      ['bg-[#F68C2A]']: history.status === 'degraded',
                    })}
                  />
                  {history.status[0]?.toUpperCase()}
                  {history.status.slice(1)}
                </div>
                {history.downtime_duration > 0 && (
                  <div className="text-[#999999] text-sm">{parseDuration(history.downtime_duration)}</div>
                )}
                {history.maintenance_duration > 0 && <div>{parseDuration(history.maintenance_duration)}</div>}
                <div className="divider my-1" />
                <div className="text-xs text-center text-[#999999]">{new Date(history.day).toDateString()}</div>
              </div>
            }
          >
            <div
              className={classnames('h-full flex-1 cursor-pointer', 'hover:brightness-[1.2] transition-all', {
                ['bg-[#00CC9B]']: history.status === 'operational',
                ['bg-[#F62A2A]']: history.status === 'downtime',
                ['bg-[#F68C2A]']: history.status === 'degraded',
              })}
            />
          </Tooltip>
        ))}
      </div>

      <div className="flex text-[#999999] text-sm">
        <span>{resource.attributes.status_history.length} days ago</span>
        <span className="ml-auto">Today</span>
      </div>
    </div>
  )
}

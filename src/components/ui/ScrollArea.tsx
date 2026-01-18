import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area'
import { forwardRef } from 'react'

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ children, className = '', style, ...props }, ref) => {
    return (
      <BaseScrollArea.Root className={`relative overflow-hidden ${className}`} style={style} {...props}>
        <BaseScrollArea.Viewport ref={ref} className="h-full w-full">
          {children}
        </BaseScrollArea.Viewport>
        <BaseScrollArea.Scrollbar
          orientation="vertical"
          className="flex w-2 touch-none select-none p-0.5 transition-colors"
        >
          <BaseScrollArea.Thumb className="relative flex-1 rounded-full bg-slate-600 hover:bg-slate-500" />
        </BaseScrollArea.Scrollbar>
        <BaseScrollArea.Scrollbar
          orientation="horizontal"
          className="flex h-2 touch-none select-none flex-col p-0.5 transition-colors"
        >
          <BaseScrollArea.Thumb className="relative flex-1 rounded-full bg-slate-600 hover:bg-slate-500" />
        </BaseScrollArea.Scrollbar>
      </BaseScrollArea.Root>
    )
  }
)

ScrollArea.displayName = 'ScrollArea'

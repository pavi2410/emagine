import { Progress as BaseProgress } from '@base-ui/react/progress'

interface ProgressProps {
  value: number
  max?: number
  className?: string
}

export function Progress({ value, max = 100, className = '' }: ProgressProps) {
  return (
    <BaseProgress.Root value={value} max={max} className={`relative h-2 w-full overflow-hidden rounded-full bg-slate-700 ${className}`}>
      <BaseProgress.Track className="h-full w-full">
        <BaseProgress.Indicator
          className="h-full bg-blue-500 transition-all duration-300 ease-out"
          style={{ width: `${(value / max) * 100}%` }}
        />
      </BaseProgress.Track>
    </BaseProgress.Root>
  )
}

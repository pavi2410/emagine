import { IconLoader } from '@tabler/icons-react'

interface SpinnerProps {
  size?: '1' | '2' | '3'
  className?: string
}

const sizeMap = {
  '1': 16,
  '2': 20,
  '3': 24,
}

export function Spinner({ size = '2', className = '' }: SpinnerProps) {
  return (
    <IconLoader
      size={sizeMap[size]}
      className={`animate-spin text-current ${className}`}
    />
  )
}

import { Button as BaseButton } from '@base-ui/react/button'
import { forwardRef } from 'react'

interface IconButtonProps extends React.ComponentProps<typeof BaseButton> {
  size?: '1' | '2' | '3'
}

const sizeStyles = {
  '1': 'w-6 h-6',
  '2': 'w-8 h-8',
  '3': 'w-10 h-10',
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ size = '2', className = '', ...props }, ref) => {
    return (
      <BaseButton
        ref={ref}
        className={`
          inline-flex items-center justify-center rounded-md
          bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800
          transition-colors cursor-pointer
          disabled:opacity-50 disabled:cursor-not-allowed
          ${sizeStyles[size]}
          ${className}
        `}
        {...props}
      />
    )
  }
)

IconButton.displayName = 'IconButton'

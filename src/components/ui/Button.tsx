import { Button as BaseButton } from '@base-ui/react/button'
import { forwardRef } from 'react'

interface ButtonProps extends React.ComponentProps<typeof BaseButton> {
  variant?: 'solid' | 'soft' | 'ghost' | 'outline' | 'danger'
  size?: '1' | '2' | '3'
}

const variantStyles = {
  solid: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
  soft: 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 active:bg-blue-500/40',
  ghost: 'text-white/80 hover:bg-white/10 active:bg-white/20',
  outline: 'border border-white/20 text-white/80 hover:bg-white/10 active:bg-white/20',
  danger: 'bg-red-500/20 text-red-300 hover:bg-red-500/30 active:bg-red-500/40',
}

const sizeStyles = {
  '1': 'px-2 py-1 text-xs',
  '2': 'px-3 py-1.5 text-sm',
  '3': 'px-4 py-2 text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'solid', size = '2', className = '', ...props }, ref) => {
    return (
      <BaseButton
        ref={ref}
        className={`
          inline-flex items-center justify-center gap-2 rounded-md font-medium
          transition-colors cursor-pointer
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

import { Input as BaseInput } from '@base-ui/react/input'
import { forwardRef } from 'react'

interface InputProps extends Omit<React.ComponentProps<typeof BaseInput>, 'size'> {
  inputSize?: '1' | '2' | '3'
}

const sizeStyles = {
  '1': 'px-2 py-1 text-xs',
  '2': 'px-3 py-1.5 text-sm',
  '3': 'px-4 py-2 text-base',
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ inputSize = '2', className = '', ...props }, ref) => {
    return (
      <BaseInput
        ref={ref}
        className={`
          w-full rounded-md
          bg-slate-800 text-white placeholder:text-slate-500
          border border-slate-700 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          ${sizeStyles[inputSize]}
          ${className}
        `}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

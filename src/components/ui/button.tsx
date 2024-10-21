/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { useNDAModi } from '@/contexts/step-state'
import { useSystem } from '@/contexts/useSystem'
import { TypeTheme } from '@/contexts/useTheme'

// eslint-disable-next-line react-refresh/only-export-components
export const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white font-montSerrat hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input border-gray-300 text-primary font-montSerrat bg-background hover:bg-accent hover:shadow-sm ',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

const variantStyle = (theme: TypeTheme) => {
  return {
    default: {
      background: theme.primary,
      color: theme.foreground,
    },
    destructive: {
      background: theme.destructive,
      color: theme.foreground,
    },
    outline: {
      background: theme.foreground,
      color: theme.primary,
    },
    link: {
      color: theme.primary,
    },
  }
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size,
      asChild = false,
      style,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    const { isOnline } = useNDAModi()
    const { theme } = useSystem()
    const [isRendered, setIsRendered] = React.useState(false)

    React.useEffect(() => {
      setIsRendered(true)
    }, [])
    // @ts-ignore
    let defaultStyle = variantStyle(theme)[variant]
    defaultStyle = !defaultStyle ? {} : defaultStyle
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isOnline === false || isRendered === false}
        style={{ ...defaultStyle, ...style }}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }

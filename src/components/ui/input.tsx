/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

// @ts-nocheck
import * as React from 'react'
import { TextField, TextFieldProps } from '@mui/material'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { DatePicker } from '@mui/x-date-pickers'
import { Button } from './button'
import { useSystem } from '@/contexts/useSystem'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Inputt = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-primary focus-visible:ring-ring focus:ring-primary focus:border-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Inputt.displayName = 'Input'

const Input = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ className, id, type, label, error, onChange, value, ...props }, ref) => {
    const { theme } = useSystem()
    const [show, setShow] = React.useState(false)

    React.useEffect(() => {
      if (value?.length) {
        setShow(true)
      }
    }, [value])

    return (
      <TextField
        id={id}
        label={label}
        variant="outlined"
        type={type}
        error={error}
        sx={{
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: theme.primary || '#72B84A',
            },
          },
          '& .MuiInputLabel-root': {
            '&.Mui-focused': {
              color: theme.primary || '#72B84A',
            },
            '& .MuiFormLabel-asterisk': {
              color: 'red', // Evita que o asterisco fique vermelho
            },
          },
        }}
        value={value}
        onChange={onChange}
        onBlur={(event) => {
          if ('value' in event.target) {
            const value = event.target.value
            if (!value) setShow(false)
            else setShow(true)
          }
        }}
        onBlurCapture={(event) => {
          if ('value' in event.target) {
            const value = event.target.value
            if (!value) setShow(false)
            else setShow(true)
          }
        }}
        onFocus={() => {
          setShow(true)
        }}
        className={cn('flex w-full', className)}
        ref={ref}
        InputProps={{
          id,
          endAdornment: value ? (
            <Button
              className="px-2 bg-transparent hover:bg-transparent"
              type="reset"
              variant="link"
              onClick={() => {
                const currentInput = document.querySelector(
                  `#${id}`
                ) as HTMLInputElement
                setShow(false)
                currentInput?.focus()
                onChange({
                  target: {
                    value: '',
                  },
                })
              }}
            >
              <X className="text-slate-400 border-white border" />
            </Button>
          ) : (
            ''
          ),
          startAdornment: show ? <p className="text-white" /> : '',
        }}
        InputLabelProps={{
          style: {
            fontFamily: 'Urbanist',
            fontSize: 13,
            color: '#8e8e8e',
          },
        }}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

interface TextProps extends React.InputHTMLAttributes<HTMLInputElement> {
  show: boolean
  error: boolean
  label: React.ReactNode
  setShow: React.Dispatch<React.SetStateAction<boolean>>
  phone: any
  handleChange(v: any): void
}
const PhoneInput = ({
  handleChange,
  phone,
  label,
  show,
  setShow,
  error,
  ...props
}: TextProps) => {
  const { theme } = useSystem()
  function handleFocus() {
    setShow(true)
  }
  React.useEffect(() => {
    if (phone?.length) {
      setShow(true)
    }
  }, [phone])

  return (
    <TextField
      {...props}
      label={label}
      type="tel"
      variant="outlined"
      inputMode="numeric"
      error={error}
      value={phone}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlurCapture={(event) => {
        if ('value' in event.target) {
          const value = event.target.value
          if (!value) setShow(false)
          else setShow(true)
        }
      }}
      onBlur={(event) => {
        if ('value' in event.target) {
          const value = event.target.value
          if (!value) setShow(false)
          else setShow(true)
        }
      }}
      className={'flex w-full'}
      fullWidth
      sx={{
        '& .MuiOutlinedInput-root': {
          '&.Mui-focused fieldset': {
            borderColor: theme.primary || '#72B84A',
          },
        },
        '& .MuiInputLabel-root': {
          '&.Mui-focused': {
            color: theme.primary || '#72B84A',
          },
        },
      }}
      InputProps={{
        id: 'phone-input',
        startAdornment: show ? <p className="text-slate-400 pr-1">+258</p> : '',
        endAdornment: phone ? (
          <Button
            className="px-2 bg-transparent hover:bg-transparent"
            type="reset"
            variant="link"
            onClick={() => {
              const currentInput = document.querySelector(
                '#phone-input'
              ) as HTMLInputElement
              currentInput?.focus()
              handleChange({
                target: {
                  value: '',
                },
              })
            }}
          >
            <X className="text-slate-400 border-white border" />
          </Button>
        ) : (
          ''
        ),
      }}
      InputLabelProps={{
        style: {
          fontFamily: 'Urbanist',
          fontSize: 14,
          color: '#8e8e8e',
        },
      }}
    />
  )
}

function InputDatePicker({
  label = 'Data de nascimento',
  value,
  onChange,
  ...props
}) {
  const { theme } = useSystem()

  return (
    <DatePicker
      {...props}
      name="date"
      label={
        <span className="text-[#8e8e8e] text-sm">
          {label} <span className="text-red-600">*</span>
        </span>
      }
      value={value}
      onChange={onChange}
      localeText={{
        cancelButtonLabel: 'Cancelar',
        okButtonLabel: 'Certo',
        toolbarTitle: 'Selecione a data',
      }}
      sx={{
        '& input': {
          fontSize: 14,
          fontFamily: 'Montserrat',
          fontWeight: 500,
        },
        '& input:focus': { borderColor: 'red' },
        '& label': {
          fontSize: 13,
          fontFamily: 'Urbanist',
          fontWeight: 500,
        },
        '& .MuiOutlinedInput-root': {
          '&.Mui-focused fieldset': {
            borderColor: theme.primary || '#72B84A',
          },
        },
        '& .MuiInputLabel-root': {
          '&.Mui-focused': {
            color: theme.primary || '#8e8e8e',
          },
        },
      }}
      format="DD/MM/YYYY"
      className="w-full border border-gray-300 text-primary rounded-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-[12px] placeholder:font-montSerrat font-montSerrat mb-0"
      slotProps={{
        field: {
          clearable: true,
        },
      }}
    />
  )
}

export { Inputt, PhoneInput, Input, InputDatePicker }

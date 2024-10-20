/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  FormItem,
  FormField,
  FormMessage,
  FormControl,
  FormLabel,
} from '@/components/ui/form'

import {
  Select,
  SelectItem,
  SelectValue,
  SelectGroup,
  SelectTrigger,
  SelectContent,
} from '@/components/ui/select'

import dayjs from 'dayjs'

import { format } from 'date-fns'
import { useState } from 'react'
import { useNDAModi } from '@/contexts/step-state'
import { UseFormReturn } from 'react-hook-form'
import { maskPhone, removeNonNumeric, truncateFileName } from '@/utils/general'
import { Input, InputDatePicker, PhoneInput } from '@/components/ui/input'
import { Sms, Call } from '@/assets/call'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { Upload } from 'lucide-react'

export function InputDefault({
  form,
  label,
  name,
  placeholder,
  type,
  required,
}: {
  name: string
  placeholder: string
  label: string
  type?: string
  form: UseFormReturn<any>
  required: boolean
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input
              id={name}
              label={label}
              type={type}
              placeholder={placeholder}
              required={required}
              lang="pt-pt"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
export function InputText({
  form,
  label,
  name,
  placeholder,
  required,
}: {
  name: string
  placeholder: string
  label: string
  form: UseFormReturn<any>
  required: boolean
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input
              id={name}
              label={label}
              lang="pt-Br"
              placeholder={placeholder}
              required={required}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
export function InputDocs({
  form,
  name,
  required,
}: {
  name: string
  placeholder: string
  required: boolean
  label: string
  form: UseFormReturn<any>
}) {
  const {
    setAllData,
    personData: { file_doc },
  } = useNDAModi()

  // @ts-ignore
  const fileName = file_doc?.name
    ? // @ts-ignore
      truncateFileName(file_doc?.name)
    : 'Nenhum arquivo selecionado'
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="w-full space-y-2">
              <Label
                htmlFor="file"
                className="text-sm font-medium text-gray-700"
              >
                Selecione um arquivo
              </Label>
              <div className="grid items-center gap-2">
                <Button
                  asChild
                  variant="outline"
                  style={{
                    color: '#252525',
                  }}
                  className="w-full justify-start text-input text-left font-normal"
                >
                  <label htmlFor="file" className="cursor-pointer">
                    <Upload className="mr-2 h-4 w-4" />
                    {fileName || 'Nenhum arquivo selecionado'}
                  </label>
                </Button>
                <Input
                  id="file"
                  type="file"
                  className="hidden h-0 w-0"
                  style={{ display: 'none' }}
                  required={required}
                  {...field}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    if (event.target?.files) {
                      setAllData({
                        file_doc: event.target?.files[0],
                      })
                    }
                    field.onChange(event)
                  }}
                />
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
export function InputPickerDate({
  form,
  label,
  name,
}: {
  name: string
  label: string
  form: UseFormReturn<any>
}) {
  const { setAllData } = useNDAModi()
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormControl>
              <InputDatePicker
                name={name}
                label={label}
                // @ts-ignore
                onChange={(
                  event: string | number | Date | dayjs.Dayjs | null | undefined
                ) => {
                  try {
                    setAllData({
                      birth_date: format(dayjs(event).toDate(), 'yyyy-MM-dd'),
                    })
                  } catch (error) {
                    console.log('Error de calendario', error)
                  }
                  field.onChange(event)
                }}
                value={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
export function InputEmail({
  form,
  label,
  name,
  placeholder,
  required,
}: {
  name: string
  placeholder: string
  label: string
  required: boolean
  form: UseFormReturn<any>
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input
              placeholder={placeholder}
              label={label}
              id="email-text"
              type="email"
              error={!!form.formState.errors?.email}
              {...field}
              value={field.value}
              required={required}
              onChange={(value) => {
                form.clearErrors([name])
                field.onChange(value)
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
export function InputTextNuit({
  form,
  label,
  name,
  placeholder,
  required,
}: {
  name: string
  placeholder: string
  label: string
  form: UseFormReturn<any>
  required: boolean
}) {
  const { setAllData } = useNDAModi()
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input
              required={required}
              placeholder={placeholder}
              id={name}
              label={label}
              type="number"
              error={!!form.formState.errors?.nuit}
              {...field}
              value={field.value}
              onChange={(event) => {
                const value = event.target.value
                if (/^\d{0,9}$/.test(value)) {
                  setAllData({
                    nuit: value,
                  })
                  field.onChange(event)
                }
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
export function InputPhone({
  form,
  label = 'Telemóvel',
  name,
  placeholder = '',
}: {
  name: string
  placeholder: string
  label: string
  required?: boolean
  form: UseFormReturn<any>
}) {
  const { setPhoneNumber } = useNDAModi()
  const [phoneShow, setPhoneShow] = useState(false)
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <PhoneInput
              show={phoneShow}
              setShow={setPhoneShow}
              label={
                <span className="font-montSerrat text-[#8e8e8e]">
                  {label} <span className="text-red-600">*</span>
                </span>
              }
              error={!!form.formState.errors?.phone}
              phone={field.value}
              placeholder={placeholder}
              name={name}
              handleChange={(event) => {
                form.clearErrors('phone')
                const rawValue = maskPhone(event.target.value)
                setPhoneNumber(removeNonNumeric(rawValue))
                field.onChange(rawValue)
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
export function InputEmailOrPhone({
  form,
  required,
}: {
  form: UseFormReturn<any>
  required: boolean
}) {
  const [isEmail, setIsEmail] = useState<'email' | 'phone'>('phone')
  const [phoneShow, setPhoneShow] = useState(false)
  const { setPhoneNumber } = useNDAModi()

  return (
    <div className="grid grid-cols-[80px_1fr] items-start justify-between gap-2">
      <Select
        value={isEmail}
        defaultValue={isEmail}
        onValueChange={(value: 'email' | 'phone') => {
          if (value === 'email') {
            setPhoneNumber('')
            form.setValue('phone', '')
          } else {
            form.setValue('email', '')
          }
          setIsEmail(value)
        }}
        required={required}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="phone">
              <Call />
            </SelectItem>
            <SelectItem value="email">
              <Sms />
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      {isEmail === 'email' && (
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Email"
                  label="Email"
                  id="email-text"
                  type="email"
                  error={!!form.formState.errors?.email}
                  {...field}
                  value={field.value}
                  onChange={(value) => {
                    form.clearErrors(['email'])
                    field.onChange(value)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {isEmail === 'phone' && (
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PhoneInput
                  show={phoneShow}
                  setShow={setPhoneShow}
                  label={
                    <span className="font-montSerrat text-[#8e8e8e]">
                      Telemóvel <span className="text-red-600">*</span>
                    </span>
                  }
                  error={!!form.formState.errors?.phone}
                  phone={field.value}
                  handleChange={(event) => {
                    form.clearErrors('phone')
                    const rawValue = maskPhone(event.target.value)
                    setPhoneNumber(removeNonNumeric(rawValue))
                    field.onChange(rawValue)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  )
}

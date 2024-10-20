/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import dayjs from 'dayjs'

import {
  InputText,
  InputDocs,
  InputEmail,
  InputPhone,
  InputTextNuit,
  InputPickerDate,
  InputEmailOrPhone,
  InputDefault,
} from '@/components/form/input-text'

import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { CreateSchema } from '@/utils/validations/schema'
import { useEffect, useState } from 'react'
import { maskPhone } from '@/utils/general'
import { useSystem } from '@/contexts/useSystem'
import { useNDAModi } from '@/contexts/step-state'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { CheckSubscriberBpin, simulateAsyncCall } from '@/actions/client'
import { Form } from '@/components/ui/form'
import { IFieldsProps } from '@/@types/types'
import { IApiResponseBpin } from '@/contexts/useSubscriber'
import {
  LoadCheck,
  LoaderRoot,
  LoadImage,
  LoadTitle,
} from '@/components/ui/loader-with-steps'
import {
  InfoDialogContainer,
  InfoDialogImage,
  InfoDialogRoot,
} from '@/components/dialogs/info-dialog'

// const formFields: FormFieldsType = [
// { label: 'Nome completo', type: 'TEXT', required: true, name: 'name' },
// { label: 'NUIT', type: 'NUIT', required: false, name: 'nuit' },
// { label: 'Data', type: 'DATE', required: false, name: 'birthday' },
// { label: 'Email', type: 'EMAIL', required: false, name: 'email' },
// {
//   label: 'Número de telefone',
//   type: 'PHONE',
//   required: true,
//   name: 'phoneNumber',
// },
// { label: 'File NUIT', type: 'FILE|DOCS', required: false, name: 'file_doc' },
// { label: 'Email', type: 'EMAIL|PHONE', required: false, name: 'OTHER' },
// {
//   label: 'Comentario',
//   type: 'OTHER',
//   required: false,
//   name: 'nuit',
//   inputType: 'text',
// },
// ];

export default function Register() {
  const [animationParent] = useAutoAnimate()
  const { modiConfig, previousPage, nextPage } = useSystem()
  const { personData, setAllData } = useNDAModi()
  const [message, setMessage] = useState('')
  const [isOpenModal, setIsOpenModal] = useState(false)

  const [isLoading, setIsLoading] = useState({
    open: false,
    title: '',
    check1: {
      isTrue: false,
      text: 'Carregando os dados',
    },
    check2: {
      isTrue: false,
      text: 'O número existe na BPIN 1.0',
    },
  })

  const { phone_number, name, birth_date, email, nuit, file_doc } = personData
  const formFields =
    modiConfig.workflowSteps.register_aditional_data.data.fields

  const schema = CreateSchema(
    formFields
      ?.filter((field) => {
        // Verifica se o campo é do tipo 'FILE|DOCS' e se já existe um arquivo
        if (field.type === 'FILE|DOCS' && file_doc) {
          return false // Exclui este campo da lista se já houver um arquivo
        }
        return true // Mantém os outros campos
      })
      ?.map((field) => ({
        name: field.name,
        required: field.required,
        type: field.type,
      })) || []
  )

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: any) {
    setIsLoading((prev) => ({
      ...prev,
      check1: { ...prev.check1, isTrue: true },
    }))

    console.clear()
    console.log('data', data)

    if (data?.name) {
      setAllData({
        name: data?.name,
      })
    }
    if (data?.nuit) {
      setAllData({
        nuit: data.nuit,
      })
    }
    if (data?.phoneNumber) {
      setAllData({
        phone_number: data?.phoneNumber,
      })
    }
    if (data?.birthday) {
      setAllData({
        birth_date: format(data.birthday, 'yyyy-MM-dd'),
      })
    }
    if (data?.email) {
      setAllData({
        email: data?.email,
      })
    }

    if (
      data?.phoneNumber &&
      data?.name &&
      data?.birthday &&
      modiConfig.apiEndpoints.bpinSearchEnabled
    ) {
      const responsebpn = await CheckSubscriberBpin<IApiResponseBpin>({
        birthday: format(data?.birthday, 'dd-MM-yyyy'),
        cell_number: data?.phoneNumber,
        config: modiConfig.apiEndpoints.bpin,
        name: data?.name,
      })

      setIsLoading((prev) => ({
        ...prev,
        check2: { ...prev.check2, isTrue: true },
      }))
      await simulateAsyncCall(false, 1000)
      setIsOpenModal(true)

      if (
        responsebpn.data?.status === 201 &&
        responsebpn.data.data.matchBirthDay === true &&
        responsebpn.data.data.matchName >= 50
      ) {
        setMessage(
          responsebpn?.message ||
            `O número de telemóvel <strong>${data?.phone}</strong> está registado`
        )
      } else {
        setMessage(
          responsebpn?.message ||
            `O número de telemóvel <strong>${data?.phone}</strong> não está registado`
        )
      }
    } else {
      nextPage()
      await simulateAsyncCall(false, 900)
    }

    setIsLoading((prev) => ({
      ...prev,
      open: false,
      check1: { isTrue: false, text: prev.check1.text },
      check2: { isTrue: false, text: prev.check2.text },
    }))
  }

  useEffect(() => {
    if (email) {
      // @ts-ignore
      form.setValue('email', email)
    }
    if (nuit) {
      // @ts-ignore
      form.setValue('nuit', nuit)
    }
    if (birth_date) {
      // @ts-ignore
      form.setValue('birthday', dayjs(birth_date) as any)
    }
    if (name) {
      // @ts-ignore
      form.setValue('name', name)
    }
    if (phone_number) {
      // @ts-ignore
      form.setValue('phoneNumber', maskPhone(phone_number))
    }
  }, [])

  const renderInput = (field: IFieldsProps, index: number) => {
    const { label, type, name, required, placeholder = '', inputType } = field

    if (type === 'TEXT') {
      return (
        <InputText
          required={required}
          key={index}
          form={form}
          name={name}
          label={label}
          placeholder={placeholder}
        />
      )
    }

    if (type === 'EMAIL|PHONE') {
      return <InputEmailOrPhone required={required} form={form} key={index} />
    }

    if (type === 'DATE') {
      return (
        <InputPickerDate form={form} label={label} name={name} key={index} />
      )
    }

    if (type === 'NUIT') {
      return (
        <InputTextNuit
          key={index}
          required={required}
          form={form}
          name={name}
          label={label}
          placeholder={placeholder}
        />
      )
    }

    if (type === 'PHONE') {
      return (
        <InputPhone
          required={required}
          key={index}
          form={form}
          name={name}
          label={label}
          placeholder={placeholder}
        />
      )
    }

    if (type === 'EMAIL') {
      return (
        <InputEmail
          key={index}
          required={required}
          form={form}
          name={name}
          label={label}
          placeholder={placeholder}
        />
      )
    }

    if (type === 'FILE|DOCS') {
      return (
        <InputDocs
          // @ts-ignore
          file={file_doc?.name}
          key={index}
          form={form}
          name={name}
          label={label}
          required={required}
          placeholder={placeholder}
        />
      )
    }

    return (
      <InputDefault
        required={required}
        form={form}
        label={label}
        type={inputType}
        name={name}
        placeholder={placeholder}
      />
    )
  }

  return (
    <main className="max-w-lg m-auto px-4 py-16 sm:py-20 h-dvh">
      <section className="h-full flex flex-col">
        <div className="flex flex-col gap-4 sm:gap-8">
          <h1 className="font-montSerrat text-lg">
            {modiConfig?.workflowSteps.register_aditional_data.data.title}
          </h1>
        </div>

        <div className="grid gap-4 mt-6 h-full" ref={animationParent}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="h-full flex flex-col justify-between"
            >
              <div className="grid gap-4">
                {formFields?.map((field, index) => renderInput(field, index))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  type="button"
                  className="font-montSerrat"
                  onClick={() => {
                    previousPage()
                  }}
                >
                  Voltar
                </Button>
                <Button
                  variant="default"
                  type="submit"
                  className="font-montSerrat text-white"
                >
                  Próximo
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </section>
      <LoaderRoot open={isLoading.open}>
        <LoadImage />
        <LoadTitle>Pesquisando se:</LoadTitle>
        <LoadCheck
          check={isLoading.check1.isTrue}
          title={isLoading.check1.text}
        />
        <LoadCheck
          check={isLoading.check2.isTrue}
          title={isLoading.check2.text}
        />
      </LoaderRoot>

      <InfoDialogRoot open={isOpenModal}>
        <InfoDialogImage warn />
        <InfoDialogContainer message={message}>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              nextPage()
            }}
          >
            Continuar
          </Button>
        </InfoDialogContainer>
      </InfoDialogRoot>
    </main>
  )
}

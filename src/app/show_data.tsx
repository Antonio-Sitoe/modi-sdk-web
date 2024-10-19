/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'
import { X, Check } from 'lucide-react'
import { Subscriber } from '@/actions/client'
import { useNDAModi } from '@/contexts/step-state'
import { FloatingLabelInput } from '@/components/ui/floating-label-input'

import {
  InfoDialogContainer,
  InfoDialogImage,
  InfoDialogRoot,
} from '@/components/dialogs/info-dialog'

import {
  convertToFormData,
  transformeDataToArray,
} from '@/utils/person-data-convertion'

import { Form } from '@/components/ui/form'
import { WarnDialog } from '@/components/dialogs/warn-dialog'
import { useSystem } from '@/contexts/useSystem'
import { TypegrapthH1 } from '@/components/ui/Typography'
import { useNavigate } from 'react-router-dom'
import { isRedTone } from '@/utils/general'

export type IFormDataSubmit = Array<{
  name: string
  value: string
  label: string
  check: boolean
  uncheck: boolean
}>

export default function ShowData() {
  const router = useNavigate()
  const { theme } = useSystem()
  const [isOpen, setIsOpen] = useState(true)
  const [message, setMessage] = useState('')
  const [isWantCancel, setIsWantCancel] = useState(false)
  const [isOpenLoungModal, setisOpenLoungModal] = useState(false)

  const { modiConfig, companyId, sethasPersonDataSended } = useSystem()

  const sendDataUrl = modiConfig.apiEndpoints.sendData
  const hasWantConfirmesChecks =
    modiConfig.workflowSteps.show_data.data.hasWantConfirmesChecks

  const {
    personData,
    setfailed_fields,
    resetAllData,
    setIsLoading,
    listDocumentType,
    setFieldsData,
    fieldsData,
  } = useNDAModi()
  const { failed_fields, document_class_code } = personData

  const [data, setData] = useState(() => {
    if (fieldsData) {
      const dataFromJson = JSON.parse(fieldsData)
      if (Array.isArray(dataFromJson)) {
        return dataFromJson
      }
    }

    return transformeDataToArray(
      personData,
      modiConfig.workflowSteps.show_data.data.dataToShow
    )
  })

  const documentName = listDocumentType.find(
    (item) => item.code === document_class_code
  )

  const form = useForm()

  function onCheckedChange({
    i,
    check,
    uncheck,
  }: {
    i: number
    check: boolean
    uncheck: boolean
  }) {
    const currentData = [...data]
    currentData[i].check = check
    currentData[i].uncheck = uncheck

    // Cria uma cópia de failed_fields para evitar mutações diretas
    const newFailedFields = { ...failed_fields }

    if (uncheck) {
      // @ts-ignore
      newFailedFields[currentData[i].name] = currentData[i].value
    }

    if (check) {
      // @ts-ignore
      delete newFailedFields[currentData[i].name]
    }
    setfailed_fields(newFailedFields)
    setData(currentData)
  }

  function validateProduts(
    produtos: Array<{
      check: boolean
      uncheck: boolean
    }>
  ) {
    for (let i = 0; i < produtos.length; i++) {
      if (produtos[i].check === produtos[i].uncheck) {
        return i
      }
    }
    return -1
  }

  async function onSubmit() {
    if (hasWantConfirmesChecks) {
      if (validateProduts(data) !== -1) {
        setIsOpen(true)
        return
      }
    }

    setIsLoading({ title: 'Submetendo os dados', isLoad: true })

    const formdata = convertToFormData(personData)
    const {
      data: dataResponse,
      error,
      message,
    } = await Subscriber(formdata, sendDataUrl)

    console.log('error', error)
    console.log('data', dataResponse)

    if (dataResponse) {
      sethasPersonDataSended(true)
      router(`/${companyId}/message`)
      setFieldsData(JSON.stringify(data))
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve('')
          setIsLoading({ title: 'Submetendo os dados', isLoad: false })
        }, 1000)
      })
    }
    if (error) {
      setMessage(message)
      setisOpenLoungModal(true)
      setIsLoading({ title: 'Submetendo os dados', isLoad: false })
    }
  }

  return (
    <main className="max-w-lg m-auto px-4 py-16 sm:py-20">
      <div className="h-full relative">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <TypegrapthH1
              className="font-montSerrat text-[#373737] text-lg"
              text="Dados capturados"
            />

            <main className="pb-52 sm:mt-16 mt-8 grid gap-8">
              <FloatingLabelInput
                id="floating-demo"
                className="disabled:opacity-100 font-montSerrat"
                label="Tipo de documento"
                value={documentName?.name || 'Bilhete de identidade'}
                disabled
              />

              {data.map(({ value, label, check, uncheck }, i) => {
                return (
                  <div
                    className={cn(
                      'w-full grid gap-4 items-center justify-between',
                      hasWantConfirmesChecks
                        ? 'grid-cols-[1fr_55px]'
                        : 'grid-cols-1'
                    )}
                    key={i}
                  >
                    <FloatingLabelInput
                      id="floating-demo"
                      className={cn('disabled:opacity-100 font-montSerrat')}
                      style={{
                        borderColor: check
                          ? isRedTone(theme.primary)
                            ? '#72B84A'
                            : theme.primary
                          : uncheck
                            ? isRedTone(theme.primary)
                              ? '#E21717'
                              : '#E21717'
                            : 'currentcolor',
                        opacity: uncheck || check ? 'initial' : 0.2,
                      }}
                      label={label}
                      value={value}
                      disabled
                    />

                    {hasWantConfirmesChecks && (
                      <div className="flex items-center gap-2 justify-end">
                        <Checkbox
                          className={cn(
                            `w-6 h-6 border-[#D9D9D9]`,
                            !check && 'opacity-20'
                          )}
                          style={{
                            background: isRedTone(theme.primary)
                              ? '#72B84A'
                              : theme.primary,
                          }}
                          checked={check}
                          onCheckedChange={(checked) =>
                            onCheckedChange({
                              i,
                              check: Boolean(checked),
                              uncheck: false,
                            })
                          }
                        >
                          <Check className="h-4 w-4 text-white" />
                        </Checkbox>
                        <Checkbox
                          style={{
                            background: '#E21717',
                          }}
                          className={cn(
                            'w-6 h-6 border-[#D9D9D9]',
                            !uncheck && 'opacity-20'
                          )}
                          checked={uncheck}
                          onCheckedChange={(checked) =>
                            onCheckedChange({
                              i,
                              check: false,
                              uncheck: Boolean(checked),
                            })
                          }
                        >
                          <X className="h-4 w-4 text-white" />
                        </Checkbox>
                      </div>
                    )}
                  </div>
                )
              })}
            </main>

            <div className="z-40 pt-16 fixed bg-white bottom-0 pb-14 w-full pr-4">
              <div className="grid grid-cols-2 justify-between gap-3 w-full max-w-[480px] pr-4 sm:pr-0">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsWantCancel(true)}
                  className="w-full text-destructive"
                >
                  Cancelar
                </Button>
                <Button
                  variant="default"
                  type="submit"
                  className="text-white w-full"
                >
                  Submeter
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>

      {hasWantConfirmesChecks && (
        <WarnDialog isOpen={isOpen} setIsOpen={setIsOpen} />
      )}

      <InfoDialogRoot open={isOpenLoungModal}>
        <InfoDialogImage />
        <InfoDialogContainer message={message}>
          <Button
            className="w-full"
            variant="outline"
            onTouchEnd={() => {
              resetAllData()
              router(`/${companyId}`)
              setisOpenLoungModal(false)
            }}
            onClick={() => {
              resetAllData()
              router(`/${companyId}`)
              setisOpenLoungModal(false)
            }}
          >
            Entendi
          </Button>
        </InfoDialogContainer>
      </InfoDialogRoot>

      <InfoDialogRoot open={isWantCancel}>
        <InfoDialogImage warn />
        <InfoDialogContainer message="Tem certeza que deseja cancelar a o processo de registo?">
          <Button
            className="w-full bg-destructive text-white hover:bg-destructive"
            onClick={() => {
              resetAllData()
              router(`/${companyId}`)
              setIsWantCancel(false)
            }}
          >
            Sim, cancelar
          </Button>
          <Button
            className="w-full"
            variant="outline"
            onClick={() => {
              setIsWantCancel(false)
            }}
          >
            Continuar
          </Button>
        </InfoDialogContainer>
      </InfoDialogRoot>
    </main>
  )
}

/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Button } from '@/components/ui/button'
import { useSystem } from '@/contexts/useSystem'
import { useNDAModi } from '@/contexts/step-state'
import { BASE64toBLOB } from '@/utils/general'
import { scanFaceMatch, Subscriber } from '@/actions/client'
import { useSubscriber } from '@/contexts/useSubscriber'
import { DocumentDialog } from '@/components/dialogs/doc-dialog'
import { SimilarityDialog } from '@/components/dialogs/similarity-dialog'
import { InforMationDialog } from '@/components/dialogs/information-dialog'
import { HasCompleteProcess } from '@/components/ui/hasComplete'
import { useEffect, useState } from 'react'

import {
  LoaderRoot,
  LoadImage,
  LoadTitle,
} from '@/components/ui/loader-with-steps'

import { convertToFormData } from '@/utils/person-data-convertion'
import { TypegrapthH1 } from '@/components/ui/Typography'
import { useNavigate } from 'react-router-dom'

export default function FaceAndDocs() {
  const router = useNavigate()
  const [isChooseDocumentModal, setChooseDocumentModal] = useState(true)
  const {
    personData,
    setSimilarity,
    resetAllData,
    setHasCompletOCR,
    setHasCompletLiveness,
    setIsLoading: setIsLoadingFn,
  } = useNDAModi()

  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState({
    title: '',
    isLoad: false,
  })

  const { hasCompletOCR, hasCompletLivesness } = useNDAModi()
  const { selfie, document_type_id } = personData
  const { extractSubscriberData } = useSubscriber()
  const [isError, setIsError] = useState(false)
  const [showDialog, setShowDialog] = useState(false)

  const [isOpenLoungModal, setisOpenLoungModal] = useState(false)
  const [isOpenModalMessageGoOn, setisOpenModalMessageGoOn] = useState(false)
  const { modiConfig, companyId, nextPage, previousPage } = useSystem()

  const sendDataUrl = modiConfig.apiEndpoints.sendData
  const startScreean = modiConfig.workflowSteps.ocr.data.startScrean

  function redirectHome() {
    router(`/${companyId}`)
    resetAllData()
    setHasCompletLiveness(false)
    setHasCompletOCR(false) // a pessoa ja fez OCR
    setShowDialog(false)
    setisOpenModalMessageGoOn(false)
  }

  async function onSubmit() {
    setIsLoadingFn({ title: 'Submetendo os dados', isLoad: true })
    const formdata = convertToFormData(personData)
    const {
      data: dataResponse,
      error,
      message,
    } = await Subscriber(formdata, sendDataUrl)

    if (dataResponse) {
      router(`/${companyId}/message`)
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve('')
          setHasCompletOCR(true) // a pessoa ja fez OCR
        }, 1000)
      })
    }
    if (error) {
      setMessage(message)
      setisOpenLoungModal(true)
      setisOpenModalMessageGoOn(false)
    }
    setIsLoadingFn({ title: 'Submetendo os dados', isLoad: false })
  }

  async function actionsSimilarity() {
    if (isError) {
      return redirectHome()
    } else if (
      modiConfig.workflowSteps.show_data.required ||
      (modiConfig.workflowSteps.liveness.required &&
        hasCompletLivesness === false)
    ) {
      nextPage()
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve('')
          setHasCompletOCR(true) // a pessoa ja fez OCR
          setShowDialog(false)
        }, 2500)
      })
    } else {
      return await onSubmit()
    }
  }

  useEffect(() => {
    const componente = document.getElementById('meu-componente')

    if (componente) {
      const handleScanResponse = async (event: any) => {
        console.log('event?.detail?.message?.data', event)
        const hasSucess =
          event?.detail.message.status === 200 ||
          event?.detail.message.status === 201

        if (hasSucess) {
          setIsLoading({
            isLoad: true,
            title: 'Extraindo os dados e validando a sua identidade',
          })

          const hasSubscriberNotFounded = false
          const {
            nutelfound,
            nutelnotfound,
            validcredencials,
            message: messageFromHook,
            withoutBpin,
          } = await extractSubscriberData(
            event.detail.message.data,
            hasSubscriberNotFounded,
          )

          if (nutelfound || validcredencials) {
            setMessage(
              messageFromHook ||
                'Os dados capturados do seu documento não correspondem aos dados inseridos.',
            )
            setisOpenLoungModal(true)
          } else if ((nutelnotfound || withoutBpin) && selfie) {
            const portrait = BASE64toBLOB(
              event.detail.message.data.portraitImage64,
            )

            if (portrait && selfie) {
              const { data, error, message } = await scanFaceMatch({
                portrait,
                selfie,
                config: modiConfig.apiEndpoints.scan_face,
              })
              console.log({ data, message })
              if (error) {
                setIsError(true)
              }
              if (data) {
                const similarityDetail = data?.data.moreDetails1[0].similarity
                const parsedSimilarity = isNaN(Number(similarityDetail))
                  ? 0
                  : Number(similarityDetail)
                const similarity = parseFloat(
                  (parsedSimilarity * 100).toFixed(2),
                )

                setSimilarity(similarity)
                if (similarity >= 65) {
                  console.log('Funciona', similarity)
                  setIsError(false)
                } else {
                  console.log('NAO Funciona', similarity)
                  setIsError(true)
                }
              }
              setShowDialog(true)
            }
          } else {
            setisOpenModalMessageGoOn(true)
          }

          setIsLoading({
            isLoad: false,
            title: 'Extraindo os dados e validando a sua identidade',
          })
        } else {
          console.log('OCORREU UM ERRO')
          setMessage('Ocorreu um erro ao capturar os dados tente novamente')
        }
      }
      componente.addEventListener('scanResponse', handleScanResponse)
      return () => {
        componente.removeEventListener('scanResponse', handleScanResponse)
      }
    }
  }, [
    extractSubscriberData,
    modiConfig.apiEndpoints.scan_face,
    selfie,
    setSimilarity,
  ])

  return (
    <main className="max-w-lg m-auto px-4 py-0 pb-16 sm:py-20 h-dvh">
      {hasCompletOCR ? (
        <HasCompleteProcess
          title="Captura de documentos realizada com sucesso!"
          goNext={() => {
            nextPage()
          }}
          goPrev={() => {
            previousPage()
          }}
        />
      ) : (
        <>
          <div className="h-full flex flex-col justify-between items-center">
            <div className="mt-3">
              <TypegrapthH1
                className="font-montSerrat text-lg font-medium text-center"
                text="Captura os documentos"
              />

              <section className="max-h-[80%]">
                {/* @ts-ignore */}
                <modi-document-reader
                  atributo1="valor1"
                  atributo2="valor2"
                  id="meu-componente"
                  class="cara"
                  multiple={document_type_id === '1' ? 'true' : 'false'}
                  start-screen={startScreean}
                >
                  {/* @ts-ignore */}
                </modi-document-reader>
              </section>
            </div>

            <div className="grid w-full">
              <SimilarityDialog open={showDialog} action={actionsSimilarity} />
              <Button
                variant="outline"
                type="button"
                className="font-montSerrat outline-none z-50"
                onClick={() => {
                  previousPage()
                }}
                onTouchEnd={() => {
                  previousPage()
                }}
              >
                Voltar
              </Button>
            </div>
          </div>

          <LoaderRoot open={isLoading.isLoad}>
            <LoadImage />
            <LoadTitle>{isLoading.title}</LoadTitle>
          </LoaderRoot>

          <DocumentDialog
            isOpen={isChooseDocumentModal}
            setIsOpen={setChooseDocumentModal}
            cancel={() => {
              setChooseDocumentModal(false)
            }}
          />

          <InforMationDialog
            message={message}
            open={isOpenLoungModal}
            sucess={false}
            btn={{
              text: 'Entendi',
              action: redirectHome,
            }}
          />

          <InforMationDialog
            message={modiConfig?.customMessages.ocrMessage}
            open={isOpenModalMessageGoOn}
            sucess={true}
            btn={{
              text: 'Feito',
              action: actionsSimilarity,
            }}
          />
        </>
      )}
    </main>
  )
}

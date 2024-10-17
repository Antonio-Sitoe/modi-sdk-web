/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  LoadCheck,
  LoaderRoot,
  LoadImage,
  LoadTitle,
} from '@/components/ui/loader-with-steps';

import {
  InfoDialogContainer,
  InfoDialogImage,
  InfoDialogRoot,
} from '@/components/dialogs/info-dialog';

import { Button } from '@/components/ui/button';

import { useSystem } from '@/contexts/useSystem';
import { livenessFn } from '@/utils/liveness';
import { useNDAModi } from '@/contexts/step-state';
import { AxiosError } from 'axios';
import { BASE64toBLOB } from '@/utils/general';
import { scanFaceMatch, search_person, Subscriber } from '@/actions/client';
import { useMediaQuery } from '@mui/material';
import { useSubscriber } from '@/contexts/useSubscriber';
import { DocumentProps } from '@/@types/interfaces';
import { HasCompleteProcess } from '@/components/ui/hasComplete';
import { useCallback, useEffect, useState } from 'react';
import { convertToFormData } from '@/utils/person-data-convertion';
import { SimilarityDialog } from '@/components/dialogs/similarity-dialog';
import { Typegrapth } from '@/components/ui/Typography';
import { useNavigate } from 'react-router-dom';

export default function FaceRecogntianLiveness() {
  const router = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isModalOtherDevice, setModalOtherDevice] = useState(false);
  const [isOpenLoungModal, setisOpenLoungModal] = useState(false);
  const [hasAlreadyData, setHasAlreadyData] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [isError, setIsError] = useState(false);

  const { modiConfig, companyId, nextPage, theme, previousPage } = useSystem();
  const { extractSubscriberData } = useSubscriber();

  const isMobile = useMediaQuery('(max-width: 768px)');
  const search_person_url = modiConfig.apiEndpoints.search_person;
  const sendDataUrl = modiConfig.apiEndpoints.sendData;
  const livenessType =
    modiConfig.workflowSteps.liveness.data.livenessType || '2';

  const {
    setSelfie,
    setSelfieBase64,
    resetAllData,
    setHasCompletLiveness,
    hasCompletLivesness,
    hasCompletOCR,
    setIsLoading: setIsLoadingFn,
    personData,
    setHasCompletOCR,
    setSimilarity,
  } = useNDAModi();

  const [isLoading, setIsLoading] = useState({
    open: false,
    title: '',
    check1: {
      isTrue: false,
      text: 'Avaliando a prova de vida',
    },
    check2: {
      isTrue: false,
      text: 'Pesquisando a cara',
    },
  });

  async function onSubmit() {
    setIsLoadingFn({ title: 'Submetendo os dados', isLoad: true });
    const formdata = convertToFormData(personData);
    const {
      data: dataResponse,
      error,
      message,
    } = await Subscriber(formdata, sendDataUrl);

    if (dataResponse) {
      router(`/${companyId}/message`);
      await new Promise(resolve => {
        setTimeout(() => {
          resolve('');
        }, 1000);
      });
    }
    if (error) {
      setMessage(message);
      setIsOpen(true);
    }
    setShowDialog(false);
    setIsLoadingFn({ title: 'Submetendo os dados', isLoad: false });
  }

  function redirectHome() {
    router(`/${companyId}`);
    resetAllData();
    setHasCompletLiveness(false);
    setHasCompletOCR(false); // a pessoa ja fez OCR
    setShowDialog(false);
  }

  async function actionsSimilarity() {
    if (isError) {
      return redirectHome;
    } else if (modiConfig.workflowSteps.show_data.required) {
      return nextPage();
    } else {
      return await onSubmit();
    }
  }

  async function handleErrorCatch(
    error: AxiosError,
    selfie: Blob,
    message: string | null,
  ) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      if (
        modiConfig.workflowSteps.ocr.required &&
        hasCompletOCR &&
        modiConfig.workflowSteps?.liveness?.data?.hasSimilarity &&
        personData.portrait &&
        selfie
      ) {
        const { data, error, message } = await scanFaceMatch({
          portrait: personData.portrait,
          selfie,
          config: modiConfig.apiEndpoints.scan_face,
        });
        console.log({ data, message });
        if (error) {
          setIsError(true);
        }
        if (data) {
          const similarityDetail = data?.data.moreDetails1[0].similarity;
          const parsedSimilarity = isNaN(Number(similarityDetail))
            ? 0
            : Number(similarityDetail);
          const similarity = parseFloat((parsedSimilarity * 100).toFixed(2));

          setSimilarity(similarity);
          if (similarity >= 65) {
            console.log('Funciona', similarity);
            setIsError(false);
          } else {
            console.log('NAO Funciona', similarity);
            setIsError(true);
          }
        }
        setShowDialog(true);
      } else {
        const page = nextPage();
        if (page === null) {
          router(`/${companyId}/message`);
        }
        console.log('[Erro na requisicao]', error.response?.status);
        await new Promise(resolve => {
          setTimeout(() => {
            setHasCompletLiveness(true);
            resolve('Face capturada com sucesso.');
          }, 2000);
        });
      }
    } else {
      setMessage(
        message ||
          'No momento, não é possível realizar a pesquisa solicitada. Por favor, tente novamente mais tarde.',
      );
      setisOpenLoungModal(true);
    }
  }

  async function handleSubscriberFounded(data: DocumentProps) {
    setMessage('');
    console.log('DADOS PROVENIENTES DO LIVENESS', data);

    const { nutelfound, nutelnotfound, validcredencials, withoutBpin } =
      await extractSubscriberData(data, true);

    if (withoutBpin || nutelfound || nutelnotfound) {
      if (modiConfig.workflowSteps.ocr.required && hasCompletOCR) {
        setShowDialog(true);
      } else {
        setHasAlreadyData(true);
      }
      setHasCompletLiveness(true);
    }

    if (validcredencials) {
      setisOpenLoungModal(true);
    }
  }

  const handleLiveness = useCallback(
    async (event: any) => {
      if (event.detail.message.success) {
        setIsLoading(prev => ({ ...prev, open: true }));

        const selfie = BASE64toBLOB(event.detail.message.data.image);
        setSelfieBase64(event.detail.message.data.image);
        setSelfie(selfie);

        setIsLoading(prev => ({
          ...prev,
          check1: { ...prev.check1, isTrue: true },
        }));

        const { data, error, message } = await search_person({
          selfie,
          config: search_person_url,
        });

        await new Promise(resolve => {
          setTimeout(resolve, 600);
        });

        setIsLoading(prev => ({
          ...prev,
          check2: { ...prev.check2, isTrue: true },
        }));

        if (error) {
          await handleErrorCatch(error as AxiosError, selfie, message);
        }

        if (data) {
          await handleSubscriberFounded(data.data);
        }

        setIsLoading(prev => ({
          ...prev,
          open: false,
          check1: { isTrue: false, text: prev.check1.text },
          check2: { isTrue: false, text: prev.check2.text },
        }));
      } else if (event.detail.message.data.data) {
        const reason = event.detail.message.data.data.reason;
        if (reason == 'CAMERA_UNKNOWN_ERROR') {
          setModalOtherDevice(true);
          console.log('[ORP]');
        }
      }
    },
    [
      extractSubscriberData,
      nextPage,
      search_person_url,
      setHasCompletLiveness,
      setSelfie,
      setSelfieBase64,
    ],
  );

  useEffect(() => {
    livenessFn(isMobile, theme.primary);

    const liveness = document.getElementById('liveness');
    window.addEventListener('resize', () =>
      livenessFn(isMobile, theme.primary),
    );

    if (liveness) {
      liveness.addEventListener('livenessResponse', handleLiveness);
      return () => {
        liveness.removeEventListener('livenessResponse', handleLiveness);
        window.removeEventListener('resize', () =>
          livenessFn(isMobile, theme.primary),
        );
      };
    }
  }, [handleLiveness, isMobile]);

  return (
    <main className="m-auto px-4 py-0 pb-16 sm:py-20 h-dvh">
      {hasCompletLivesness ? (
        <HasCompleteProcess
          title="Processo de Reconhecimento facial concluido"
          goNext={() => {
            const page = nextPage();
            if (page === null) {
              router(`/${companyId}/message`);
            }
          }}
          goPrev={() => {
            previousPage();
          }}
        />
      ) : (
        <>
          <div className="flex flex-col items-start justify-between h-full">
            <div className="flex flex-col gap-4 w-full mx-auto max-w-lg">
              <div className="mt-3 flex items-start justify-center gap-3 w-full h-1/2">
                {/* @ts-ignore */}
                <modi-face-liveness
                  atributo1="valor5"
                  atributo2="valor6"
                  id="liveness"
                  livenessType={livenessType}
                >
                  {/* @ts-ignore */}
                </modi-face-liveness>
              </div>
            </div>
            <div className="grid w-full max-w-lg mx-auto">
              <Button
                variant="outline"
                type="button"
                className="z-50"
                onTouchEnd={() => {
                  previousPage();
                }}
                onClick={() => {
                  previousPage();
                }}
              >
                Voltar
              </Button>
            </div>
          </div>

          <SimilarityDialog open={showDialog} action={actionsSimilarity} />

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

          <InfoDialogRoot open={isModalOtherDevice}>
            <InfoDialogImage sucess={false} />
            <InfoDialogContainer
              message={
                <Typegrapth
                  text="Seu telemóvel está com problemas na câmera. Deseja continuar
                    o processo utilizando outro telemóvel?"
                />
              }
            >
              <Button
                variant="outline"
                className="w-full"
                style={{
                  color: theme.destructive,
                }}
                onClick={() => {
                  resetAllData();
                  router(`/${companyId}`);
                  setModalOtherDevice(false);
                }}
                onTouchEnd={() => {
                  resetAllData();
                  router(`/${companyId}`);
                  setModalOtherDevice(false);
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="default"
                className="w-full"
                onClick={() => {
                  router(`/${companyId}/scanQrcode`);
                  setModalOtherDevice(false);
                }}
                onTouchEnd={() => {
                  router(`/${companyId}/scanQrcode`);
                  setModalOtherDevice(false);
                }}
              >
                Sim
              </Button>
            </InfoDialogContainer>
          </InfoDialogRoot>

          <InfoDialogRoot open={isOpenLoungModal}>
            <InfoDialogImage sucess={false} />
            <InfoDialogContainer message={message}>
              <Button
                className="w-full"
                variant="default"
                onClick={() => {
                  resetAllData();
                  router(`/${companyId}`);
                  setisOpenLoungModal(false);
                  setHasAlreadyData(false);
                }}
                onTouchEnd={() => {
                  resetAllData();
                  router(`/${companyId}`);
                  setisOpenLoungModal(false);
                  setHasAlreadyData(false);
                }}
              >
                Entendi
              </Button>
            </InfoDialogContainer>
          </InfoDialogRoot>

          <InfoDialogRoot open={isOpen}>
            <InfoDialogImage sucess={false} />
            <InfoDialogContainer message={message}>
              <Button
                className="w-full"
                variant="default"
                onClick={() => {
                  setIsOpen(false);
                  resetAllData();
                  router(`/${companyId}`);
                  setisOpenLoungModal(false);
                  setHasAlreadyData(false);
                }}
                onTouchEnd={() => {
                  setIsOpen(false);
                  resetAllData();
                  router(`/${companyId}`);
                  setisOpenLoungModal(false);
                  setHasAlreadyData(false);
                }}
              >
                Tentar novamente
              </Button>
            </InfoDialogContainer>
          </InfoDialogRoot>

          <InfoDialogRoot open={hasAlreadyData}>
            <InfoDialogImage sucess={true} />
            <InfoDialogContainer
              message={modiConfig?.customMessages.sucessFace}
            >
              <Button
                className="w-full"
                onTouchEnd={onSubmit}
                onClick={onSubmit}
                variant="default"
              >
                Continuar
              </Button>
            </InfoDialogContainer>
          </InfoDialogRoot>
        </>
      )}
    </main>
  );
}

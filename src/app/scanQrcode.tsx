/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

import { simulateAsyncCall } from '@/actions/client';
import { maskPhone } from '@/utils/general';

import {
  InfoDialogContainer,
  InfoDialogImage,
  InfoDialogRoot,
} from '@/components/dialogs/info-dialog';

// import logo from '@/assets/logoMode.png';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { PhoneInput } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNDAModi } from '@/contexts/step-state';
import { useEffect, useRef, useState, useTransition } from 'react';
import { extractToken } from '@/utils/general';
import { phoneSchema } from '@/utils/validations/phone';

import {
  LoaderRoot,
  LoadImage,
  LoadTitle,
} from '@/components/ui/loader-with-steps';

import Countdown from '@/components/ui/countdown';
import { Skeleton } from '@/components/ui/skeleton';
import { QRCodeSVG } from 'qrcode.react';
import { useSystem } from '@/contexts/useSystem';
import { checkQrCodeSdk, getLinkGenerated } from '@/actions/client';
import { Typegrapth, TypegrapthH1 } from '@/components/ui/Typography';
import { useNavigate } from 'react-router-dom';

const TIMER = 60;

const schema = z.object({
  phone: phoneSchema,
});

export default function ChooseFlowPage() {
  const router = useNavigate();
  const timeOutId = useRef<number | NodeJS.Timeout | null>(null);
  const intervalId = useRef<number | NodeJS.Timeout | null>(null);
  const { companyId, modiConfig } = useSystem();

  const scanQrcode = modiConfig.workflowSteps.scanQrcode.data;

  const { resetAllData } = useNDAModi();

  const [time, setTime] = useState(0);
  const [link, setLink] = useState('');
  const [tellShow, settellShow] = useState(false);
  const [initTimer, setInitTimer] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isOpenErrorModal, setIsOpenErrorModal] = useState(false);

  const [isPending, startTransition] = useTransition();
  const [isSubmittingData, setIsSubmettingData] = useState(false);
  const [hasRedirectSuccessfuly, sethasRedirectSuccessfuly] = useState(false);

  const [isLoading, setIsLoading] = useState({
    isLoad: false,
    title: '',
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  function executeFunctionPeriodically(
    asyncFunction: () => Promise<void>,
    interval = 10000,
  ) {
    return new Promise((_, reject) => {
      intervalId.current = setInterval(async () => {
        try {
          await asyncFunction();
        } catch (error) {
          clearInterval(intervalId.current as NodeJS.Timeout); // Para a execução em caso de erro
          reject(error); // Rejeita a promessa com o erro
        }
      }, interval);

      timeOutId.current = setTimeout(
        () => {
          clearInterval(intervalId.current as NodeJS.Timeout);
        },
        15 * 60 * 1000, // 15 MINUTOS
      );
    });
  }

  async function onSubmit({ phone }: z.infer<typeof schema>) {
    clearInterval(intervalId.current as NodeJS.Timeout);
    setIsSubmettingData(true);
    const { data, error, message } = await getLinkGenerated({
      companyId,
      contact: phone,
      config: modiConfig.apiEndpoints.sendToken,
    });
    if (error) {
      setErrorMessage(message);
      setIsSubmettingData(false);
      setIsOpenErrorModal(true);
      return;
    }

    if (data) {
      setInitTimer(true);
      setTime(TIMER);
      setLink(data.data.link);
      await executeFunctionPeriodically(() =>
        checkIsQrcodeWasScanned({
          token_url: data.data.token,
          url: modiConfig.apiEndpoints.checkQrcode,
        }),
      );
    }
  }

  async function getLink(
    companyId: string,
    config: {
      url: string;
      token: string;
    },
  ) {
    const { data } = await getLinkGenerated({ companyId, config });
    if (data) {
      setLink(data.data.link);
    }
  }

  async function checkIsQrcodeWasScanned({
    token_url,
    url,
  }: {
    token_url: string;
    url: {
      url: string;
      token: string;
    };
  }) {
    const { data } = await checkQrCodeSdk<{
      status_code: number;
    }>(token_url, url);
    console.log('[QRCODE WAS SCANNED] ', data);
    if (data?.status_code === 200) {
      clearInterval(intervalId.current as NodeJS.Timeout);
      if (timeOutId.current) {
        clearTimeout(timeOutId.current);
      }
      setIsLoading({
        isLoad: true,
        title: 'Enviando o subscritor para outro dispositivo',
      });
      sethasRedirectSuccessfuly(true);
      await simulateAsyncCall(false);
      console.log('[ACABOU AQUI NO PC]', timeOutId.current);
      setIsLoading({
        isLoad: false,
        title: 'Enviando o subscritor para outro dispositivo',
      });
    }
  }

  useEffect(() => {
    if (time === 0) {
      setIsSubmettingData(false);
    }
  }, [time]);

  useEffect(() => {
    startTransition(
      // @ts-ignore
      async () => await getLink(companyId, modiConfig?.apiEndpoints?.sendToken),
    );
    return () => {
      clearInterval(intervalId.current as NodeJS.Timeout);
    };
  }, [companyId, modiConfig.apiEndpoints.sendToken]);

  useEffect(() => {
    if (link) {
      executeFunctionPeriodically(
        async () =>
          await checkIsQrcodeWasScanned({
            token_url: extractToken(link),
            url: modiConfig.apiEndpoints.checkQrcode,
          }),
        5000,
      );
    }
    return () => {
      clearInterval(intervalId.current as NodeJS.Timeout);
      if (timeOutId.current) {
        clearTimeout(timeOutId.current);
        timeOutId.current = null;
      }
    };
  }, [link, modiConfig.apiEndpoints.checkQrcode]);

  function generateNewQrcode() {
    startTransition(
      // @ts-ignore
      async () => await getLink(companyId, modiConfig.apiEndpoints.sendToken),
    );
    form.setValue('phone', '');
    setTime(0);
    settellShow(false);
    setInitTimer(false);
    sethasRedirectSuccessfuly(false);
  }

  function handleGotoHome() {
    resetAllData();
    router(`/?companyId=${companyId}`);
  }

  if (hasRedirectSuccessfuly) {
    return (
      <main className="max-w-lg m-auto px-4 pb-20 pt-6 h-dvh">
        <div className="h-full flex flex-col justify-between">
          {scanQrcode.img && (
            <div className="w-full flex items-center justify-center">
              <img
                width={80}
                height={60}
                src={scanQrcode.img}
                alt="imagem onboard slide1"
              />
            </div>
          )}

          <div className="w-full mx-auto text-center">
            {modiConfig.assets.warnIcon && (
              <img
                width={60}
                height={60}
                src={modiConfig.assets.warnIcon}
                alt="Icone de informacao ou aviso"
                className="sm:w-14 sm:h-14 w-8 h-8 mx-auto"
              />
            )}

            <TypegrapthH1
              text={scanQrcode.qrcodeWasScan.message}
              className=" mt-6 text-center font-montSerrat text-sm font-normal"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-7 items-end w-full">
            <Button
              variant="outline"
              type="button"
              onClick={generateNewQrcode}
              className="font-montSerrat w-full"
            >
              Novo QR Code
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={handleGotoHome}
              className="font-montSerrat w-full"
            >
              Página inicial
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-lg m-auto px-4 pb-20 pt-6 h-dvh">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="h-full flex flex-col bg-white justify-between z-30"
        >
          <div className="w-full h-full rounded-md px-0">
            <div className="mb-3">
              {scanQrcode.img && (
                <img
                  width={100}
                  height={45}
                  className="mx-auto"
                  src={scanQrcode.img}
                  alt="imagem onboard slide1"
                />
              )}
            </div>
            <TypegrapthH1
              text={scanQrcode.title}
              className="text-center mb-2 text-black font-montSerrat text-sm  sm:text-lg font-semibold sm:font-normal"
            />

            <Typegrapth
              text={scanQrcode.subtitle}
              className="text-center text-black font-montSerrat text-sm font-normal"
            />

            <div className="sm:max-w-[170px] mx-auto p-4 flex items-center justify-center rounded-md">
              {isPending ? (
                <Skeleton className="h-[125px] w-full max-w-[170px] rounded-xl" />
              ) : (
                <QRCodeSVG
                  value={link}
                  size={138}
                  bgColor="#ffffff"
                  fgColor="black"
                  level={'M'}
                  includeMargin={false}
                  imageSettings={{
                    src: '',
                    x: undefined,
                    y: undefined,
                    height: 35,
                    width: 35,
                    excavate: true,
                  }}
                />
              )}
            </div>

            <div className="text-center w-full">ou</div>
            <div className="mt-6">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <PhoneInput
                        show={tellShow}
                        setShow={settellShow}
                        label={
                          <span className="font-montSerrat text-[#8e8e8e]">
                            Telemóvel <span className="text-red-600">*</span>
                          </span>
                        }
                        error={!!form.formState.errors?.phone}
                        phone={field.value || ''}
                        handleChange={event => {
                          form.clearErrors('phone');
                          const rawValue = maskPhone(event.target.value);
                          field.onChange(rawValue);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {initTimer && (
            <Countdown setValue={() => {}} time={time} setTime={setTime} />
          )}
          <div className="w-full grid grid-cols-2 gap-2 mt-10">
            <Button
              variant="outline"
              className="text-primary"
              onClick={() => router(-1)}
              type="button"
              disabled={isLoading.isLoad}
            >
              Voltar
            </Button>
            <Button
              disabled={isSubmittingData}
              type="submit"
              className="flex items-center gap-2"
            >
              {initTimer ? 'Reenviar' : 'Enviar'}
              {isSubmittingData && (
                <div className="loader border-[3px] border-white border-t-transparent rounded-full w-3 h-3 animate-spin" />
              )}
            </Button>
          </div>
        </form>
      </Form>

      <InfoDialogRoot open={isOpenErrorModal}>
        <InfoDialogImage sucess={false} />
        <InfoDialogContainer message={errorMessage}>
          <Button
            className="w-full"
            onClick={() => {
              setIsOpenErrorModal(false);
            }}
          >
            Tentar novamente
          </Button>
        </InfoDialogContainer>
      </InfoDialogRoot>

      <LoaderRoot open={isLoading.isLoad}>
        <LoadImage />
        <LoadTitle>{isLoading.title}</LoadTitle>
      </LoaderRoot>
    </main>
  );
}

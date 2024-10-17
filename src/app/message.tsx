'use client';

import { useSystem } from '@/contexts/useSystem';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { Typegrapth } from '@/components/ui/Typography';

function Message() {
  const { modiConfig } = useSystem();

  function handleGoBack() {
    if (modiConfig.autoClose) {
      window.close();
    } else {
      window.location.href = modiConfig.redirectUrl;
    }
  }

  useEffect(() => {
    if (modiConfig.workflowSteps.message.required === false) {
      window.close();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="max-w-lg m-auto px-4 py-16 sm:py-20 h-dvh">
      <div className="flex flex-col items-center justify-center h-full bg-background px-4 py-12">
        <div className="max-w-[300px] w-full">
          <img
            src={modiConfig.assets.sucessIcon}
            width={80}
            height={80}
            alt="Process Complete"
            className="mx-auto"
          />
          <div className="mt-6 text-center">
            <Typegrapth
              className="text-lg font-normal font-montSerrat"
              text={modiConfig.workflowSteps.message.data.title.sucess}
            />
            <Typegrapth
              className="mt-2 text-sm text-[#37373799] font-montSerrat"
              text={modiConfig.workflowSteps.message.data.description.sucess}
            />
          </div>
          <div className="w-full flex items-center justify-center">
            <Button
              onClick={handleGoBack}
              onTouchEnd={handleGoBack}
              className="mt-6 w-full"
              variant="default"
            >
              Voltar
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Message;

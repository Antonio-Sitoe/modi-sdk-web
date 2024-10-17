/* eslint-disable react-hooks/exhaustive-deps */
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useSystem } from '@/contexts/useSystem';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typegrapth, TypegrapthH1 } from '@/components/ui/Typography';

export default function Home() {
  const { modiConfig, companyId, nextPage, theme } = useSystem();
  const navigate = useNavigate(); // Substituição do useRouter

  const { info, button, buttonRedirect, title } =
    modiConfig.workflowSteps.initial.data;

  const isQrcodeRequired = modiConfig.workflowSteps.scanQrcode.active;

  async function handleRedirect() {
    navigate(`/${companyId}/scanQrcode`); // Usando navigate para redirecionamento
  }

  function getInitSubscriber() {
    nextPage();
  }

  useEffect(() => {
    if (modiConfig.workflowSteps.initial.required === false) {
      nextPage();
    }
  }, []);

  return (
    <main className="max-w-lg m-auto px-4 py-16 sm:py-20 h-dvh flex flex-col items-start justify-between">
      <div className="mt-10 grid items-start justify-start gap-10 w-full">
        <div className="flex flex-col gap-4">
          <TypegrapthH1 className="text-center" text={title} />
        </div>
        {info.map(({ description, img, title, action }, i) => {
          return (
            <div className="flex flex-col" key={i}>
              <div className="flex gap-5 items-center">
                <img src={img} width={40} height={40} alt="Illustration" />
                <div className="grid gap-2">
                  <TypegrapthH1 className="text-base" text={title} />
                  <Typegrapth
                    text={description}
                    style={{ color: theme.textAlt }}
                  />
                </div>
              </div>

              {action && isQrcodeRequired && (
                <div className="pl-14">
                  <Button
                    onClick={handleRedirect}
                    onTouchEnd={handleRedirect}
                    style={{
                      color: theme.primary,
                    }}
                    className={`w-56 py-3 font-semibold hover:bg-transparent flex items-center gap-2`}
                    variant="link"
                  >
                    {buttonRedirect.label}
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {button.label && (
        <div className="grid gap-4 mt-7 items-end w-full">
          <Button
            variant="default"
            type="button"
            className={cn('font-montSerrat w-full')}
            onClick={getInitSubscriber}
            onTouchEnd={getInitSubscriber}
          >
            {button.label}
          </Button>
        </div>
      )}
    </main>
  );
}

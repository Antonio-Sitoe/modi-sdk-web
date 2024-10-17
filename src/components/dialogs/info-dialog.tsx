import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useNDAModi } from '@/contexts/step-state';
import { useSystem } from '@/contexts/useSystem';

function InfoDialogRoot({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent
        autoFocus
        className="bg-white border-none px-2 w-11/12 sm:w-full rounded-md"
      >
        <div className="w-full h-full  sm:p-5 p-2">{children}</div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function InfoDialogContainer({
  message,
  children,
}: {
  message: string | TrustedHTML | React.ReactNode;
  children: React.ReactNode;
}) {
  const { theme } = useSystem();
  return (
    <>
      <AlertDialogHeader>
        {typeof message === 'string' ? (
          <AlertDialogTitle
            className="text-center text-sm sm:text-base sm:mb-14 sm:mt-10 mb-8 mt-4 font-normal"
            dangerouslySetInnerHTML={{ __html: message }}
            style={{
              color: theme.text,
            }}
          />
        ) : (
          <AlertDialogTitle
            className="text-center text-sm sm:text-base sm:mb-14 sm:mt-10 mb-8 mt-4 font-normal"
            style={{
              color: theme.text,
            }}
          >
            {message as React.ReactNode}
          </AlertDialogTitle>
        )}
      </AlertDialogHeader>
      <div className="flex items-center gap-2">{children}</div>
    </>
  );
}

function InfoDialogImage({
  src,
  sucess,
  warn,
}: {
  src?: string;
  sucess?: boolean;
  warn?: boolean;
}) {
  const { isOnline } = useNDAModi();
  const { modiConfig } = useSystem();
  let source: string;
  if (src) source = src;
  else if (warn) source = modiConfig.assets.warnIcon || '/warn.svg';
  else if (sucess) source = modiConfig.assets.sucessIcon || '/Sucess.svg';
  else source = modiConfig.assets.errorIcon || '/errorClose.svg';
  return (
    <div className="w-full flex items-end justify-center">
      {isOnline && (
        <img
          src={source}
          alt="close modal sucess"
          width={80}
          height={80}
          className="sm:w-20 sm:h-20 h-14 w-14"
        />
      )}
    </div>
  );
}

export { InfoDialogImage, InfoDialogRoot, InfoDialogContainer };

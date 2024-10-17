import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { Button } from '../ui/button';
import { useNDAModi } from '@/contexts/step-state';
import { useSystem } from '@/contexts/useSystem';

function InforMationDialog({
  open,
  btn,
  message,
  sucess,
  warn,
}: {
  open: boolean;
  sucess: boolean;
  message: string;
  warn?: boolean;
  btn: {
    action: () => void;
    text: string;
  };
}) {
  const { modiConfig, theme } = useSystem();
  const { isOnline } = useNDAModi();
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="bg-white border-none px-2 w-11/12 sm:w-full rounded-md">
        <div className="w-full h-full  sm:p-5 p-2">
          <div className="w-full flex items-end justify-center">
            {isOnline && (
              <img
                src={
                  warn
                    ? modiConfig.assets.warnIcon
                    : sucess
                      ? modiConfig.assets.sucessIcon
                      : modiConfig.assets.errorIcon
                }
                alt="close modal sucess"
                width={80}
                height={80}
                className="sm:w-20 sm:h-20 h-14 w-14"
              />
            )}
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle
              className="text-center text-sm sm:text-base sm:mb-14 sm:mt-10 mb-8 mt-4 font-normal"
              dangerouslySetInnerHTML={{ __html: message }}
              style={{
                color: theme.text,
              }}
            />
          </AlertDialogHeader>
          <Button
            variant={sucess ? 'outline' : 'default'}
            className="w-full"
            onTouchEnd={btn.action}
            onClick={btn.action}
          >
            {btn.text}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { InforMationDialog };

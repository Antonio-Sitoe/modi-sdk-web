import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { getImageSrc } from '@/utils/general';
import { useNDAModi } from '@/contexts/step-state';
import { useSystem } from '@/contexts/useSystem';

export function SimilarityDialog({
  open,
  action,
}: {
  open: boolean;
  action: () => void;
}) {
  const { personData } = useNDAModi();
  const { modiConfig, theme } = useSystem();
  const { portraitImage64, selfieBase64, similarity } = personData;
  const isError = similarity <= 65;

  return (
    <div>
      <Dialog open={open}>
        <DialogContent className="sm:max-w-[540px] w-11/12 p-5 sm:p-10 rounded-md">
          <DialogHeader className="w-full">
            <DialogTitle className="hidden" />
            <img
              src={
                isError
                  ? modiConfig.assets.errorIcon
                  : modiConfig.assets.sucessIcon
              }
              alt=""
              width={70}
              height={70}
              className="text-center mx-auto mb-5 w-10 h-10 sm:w-16 sm:h-16"
            />
            {isError ? (
              <p className="text-center sm:text-base text-sm">
                {
                  modiConfig.workflowSteps.ocr.data.similarityDialog
                    .errorMessage
                }{' '}
                <span
                  style={{ color: theme.destructive }}
                  className="font-semibold"
                >
                  {similarity}%
                </span>{' '}
                {modiConfig.workflowSteps.ocr.data.similarityDialog.restMessage}
              </p>
            ) : (
              <p className="text-center sm:text-base text-sm">
                {
                  modiConfig.workflowSteps?.ocr?.data?.similarityDialog
                    .sucessMessage
                }{' '}
                <span className="font-semibold text-[#72B84A]">
                  {similarity}%
                </span>{' '}
                {
                  modiConfig.workflowSteps?.ocr?.data?.similarityDialog
                    ?.restMessage
                }
              </p>
            )}
          </DialogHeader>
          <div className="mx-auto sm:p-4 rounded-md">
            <div className="grid gap-8 items-start justify-between grid-cols-2 sm:mt-8">
              <div className="flex flex-col gap-3 h-full">
                <p className="sm:text-base text-sm">Foto do documento</p>
                <div className="h-full bg-[whitesmoke] flex items-center w-full sm:h-64">
                  <img
                    src={`${getImageSrc(portraitImage64)}`}
                    alt=""
                    width={20}
                    height={20}
                    className="w-full h-full rounded-md object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3 h-full">
                <p className="sm:text-base text-sm">Foto da face</p>
                <div className="h-full bg-[whitesmoke] flex items-center w-full sm:h-64">
                  <img
                    src={`${getImageSrc(selfieBase64)}`}
                    alt=""
                    width={20}
                    height={20}
                    className="w-full h-full rounded-md object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
          <Button
            className="w-full"
            onClick={action}
            onTouchEnd={action}
            variant="default"
            type="button"
          >
            {isError ? 'Tentar novamente' : 'Feito'}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

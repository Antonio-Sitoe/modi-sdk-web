'use client';

import { isMobile } from '@/utils/device';
import { useMediaQuery } from '@mui/material';
import React, { useEffect, useState, ReactNode, useCallback } from 'react';
import { useSystem } from './useSystem';

interface PortraitOnlyProps {
  children: ReactNode;
}

const PortraitOnly: React.FC<PortraitOnlyProps> = ({ children }) => {
  const isClient = typeof window !== 'undefined';
  const mobile = useMediaQuery('(max-width: 768px)');
  const { modiConfig } = useSystem();
  const [isPortrait, setIsPortrait] = useState(true);
  const landscape = modiConfig.assets.landscape;
  const poweredBy = modiConfig.assets.poweredBy;

  const checkOrientation = useCallback(() => {
    if (isClient) {
      setIsPortrait(window.innerHeight > window.innerWidth);
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient) {
      checkOrientation();
      window.addEventListener('resize', checkOrientation);
      window.addEventListener('orientationchange', checkOrientation);

      // Limpeza dos event listeners quando o componente for desmontado
      return () => {
        window.removeEventListener('resize', checkOrientation);
        window.removeEventListener('orientationchange', checkOrientation);
      };
    }
  }, [checkOrientation, isClient]);

  return (
    <>
      {isClient && (mobile || isMobile()) && !isPortrait && (
        <main className="fixed inset-0 z-100 flex justify-center items-center h-screen bg-gray-100 text-center p-5">
          <div className="grid gap-4">
            <img
              src={landscape}
              width={124}
              height={113}
              alt={modiConfig.customMessages.landascapeMessage}
              className="mx-auto"
            />
            <p className="text-lg font-normal font-montSerrat">
              Gire o seu telemóvel para o modo retrato
              {modiConfig.customMessages.landascapeMessage}
            </p>
          </div>
        </main>
      )}
      <div className="fixed bottom-6 z-10 rounded-full w-full flex items-center justify-center">
        <img width={160} height={80} src={poweredBy} alt="poweredBy image" />
      </div>
      {children}
    </>
  );
};

export { PortraitOnly };

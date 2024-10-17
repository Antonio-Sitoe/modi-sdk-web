'use client';
import '@/lib/dayjs';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useNDAModi } from './step-state';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PortraitOnly } from './PortraitOnly';
import { DYNAMIC_ROUTES } from '@/@types/interfaces';
import { SystemConfiguration, WorkFlowSteps } from '@/@types/types';
import { TypeTheme, useTheme } from './useTheme';
import { LocalizationProvider } from '@mui/x-date-pickers';

import { getPathData } from '@/utils/general';
import ContextNetworkLib from './ContextNetworkLib';
import { useNavigate, useLocation } from 'react-router-dom';

const SystemContext = createContext(
  {} as {
    modiConfig: SystemConfiguration;
    theme: TypeTheme;
    companyId: string;
    hasPersonDataSended: boolean;
    sethasPersonDataSended(hasPersonDataSended: boolean): void;
    previousPage(): void;
    nextPage(): void;
  },
);

function getRouteNavigation(
  currentRouteKey: string,
  routesConfig: WorkFlowSteps,
) {
  // Transforma o objeto em um array de rotas, ordenado pelo campo "order"
  const sortedRoutes = Object.entries(routesConfig)
    .filter(([, value]) => value.required) // apenas rotas required
    .sort(([, a], [, b]) => a.order - b.order);

  // Encontra o índice da rota atual no array ordenado
  const currentIndex = sortedRoutes.findIndex(
    ([key]) => key === currentRouteKey,
  );

  // Se a rota atual não for encontrada, retorna null
  if (currentIndex === -1) {
    return null;
  }

  // Define a rota anterior e a próxima com base no índice
  const previousRoute = sortedRoutes[currentIndex - 1]
    ? sortedRoutes[currentIndex - 1][0]
    : null;
  const nextRoute = sortedRoutes[currentIndex + 1]
    ? sortedRoutes[currentIndex + 1][0]
    : null;

  return {
    previousRoute,
    currentRoute: currentRouteKey,
    nextRoute,
  };
}

export function SystemStorage({
  children,
  systemConfig,
  companyId,
}: {
  children: ReactNode;
  systemConfig: SystemConfiguration;
  companyId: string;
}) {
  const router = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const [modiConfig, setModiConfig] =
    useState<SystemConfiguration>(systemConfig);
  const [hasPersonDataSended, sethasPersonDataSended] = useState(false);
  const { setListDocumentType, setIsOnline, setIsLoading } = useNDAModi();
  const theme = useTheme(systemConfig.theme);

  const dinamic_routes = getPathData(pathname) as DYNAMIC_ROUTES;

  const currentRouteKey = dinamic_routes;
  const flowObject = systemConfig.workflowSteps;
  const navigation = getRouteNavigation(currentRouteKey, flowObject);

  const nextPage = () => {
    setIsLoading({ isLoad: true, title: 'Carregando os dados' });
    const nextRoute = navigation?.nextRoute;
    console.log('nextRoute', nextRoute);
    if (nextRoute) {
      router(`/${nextRoute}?companyId=${companyId}`);
    }
    setIsLoading({ isLoad: false, title: 'Carregando os dados' });
    return nextRoute;
  };

  const previousPage = () => {
    const previewsRoute = navigation?.previousRoute;
    if (previewsRoute === 'initial') {
      router(`/?companyId=${companyId}`);
    } else if (previewsRoute) {
      router(`/${previewsRoute}?companyId=${companyId}`);
    }
    return previewsRoute;
  };

  useEffect(() => {
    setModiConfig(systemConfig);
    setListDocumentType(systemConfig.document_type);
  }, [setListDocumentType, systemConfig]);

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof Offline !== 'undefined') {
      const handleOnline = () => {
        console.log('Online');
        setIsOnline(true);
      };

      const handleOffline = () => {
        console.log('Offline');
        setIsOnline(false);
      };

      Offline.options = {
        checkOnLoad: true,
        interceptRequests: true,
        reconnect: {
          initialDelay: 3,
          delay: 10,
        },
      };

      Offline.on('up', handleOnline);
      Offline.on('down', handleOffline);

      return () => {
        Offline.off('up', handleOnline);
        Offline.off('down', handleOffline);
      };
    }
  }, [setIsOnline]);

  const value = {
    modiConfig,
    theme,
    companyId,
    hasPersonDataSended,
    sethasPersonDataSended,
    previousPage,
    nextPage,
  };
  return (
    <SystemContext.Provider value={value}>
      <PortraitOnly>
        <ContextNetworkLib />
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
          {children}
        </LocalizationProvider>
      </PortraitOnly>
    </SystemContext.Provider>
  );
}

export const useSystem = () => {
  const modiConfig = useContext(SystemContext);
  return modiConfig;
};

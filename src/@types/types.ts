import { TypeTheme } from '@/contexts/useTheme';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ApiEndpoints {
  bpinSearchEnabled: boolean;
  livenessSdk: string;
  ocrSdk: string;
  bpin: {
    url: string;
    token: string;
  };
  search_person: {
    url: string;
    token: string;
  };
  scan_face: {
    url: string;
    token: string;
  };
  checkQrcode: {
    url: string;
    token: string;
  };
  sendToken: {
    url: string;
    token: string;
  };
  sendData: {
    url: string;
    token: string;
  };
}

interface AssetUrls {
  warnIcon: string;
  errorIcon: string;
  sucessIcon: string;
  landscape: string;
  poweredBy: string;
  check: string;
  logo: string;
}

interface DocumentType {
  id: number;
  name: string;
  code: string;
}

interface InitialWorkflowStep {
  order: number;
  required: boolean;
  data: {
    title: string;
    info: {
      title: string;
      description: string;
      img: string;
      action?: string;
    }[];
    buttonRedirect: {
      label: string;
    };
    button: {
      label: string;
    };
  };
}
interface LivenessWorkflowStep {
  order: number;
  required: boolean;
  data: {
    livenessType: string;
    hasSimilarity: boolean;
  };
}
export type Type =
  | 'TEXT'
  | 'NUIT'
  | 'PHONE'
  | 'EMAIL|PHONE'
  | 'EMAIL'
  | 'DATE'
  | 'FILE|DOCS'
  | 'OTHER';

export interface IFieldsProps {
  label: string;
  type: Type;
  required: boolean;
  inputType?: string;
  placeholder?: string;
  name: string;
}

export type FormFieldsType = Array<IFieldsProps>;

interface RegisterAditionalDataWorkflowStep {
  order: number;
  required: boolean;
  data: {
    title: string;
    fields: FormFieldsType;
  };
}

interface OcrWorkflowStep {
  order: number;
  required: boolean;
  data: {
    startScrean: boolean;
    documentDialog: {
      title: string;
      label: string;
      img: string;
    };
    similarityDialog: {
      sucessMessage: string;
      errorMessage: string;
      restMessage: string;
    };
  };
}

interface ShowDataWorkflowStep {
  order: number;
  required: boolean;
  data: {
    hasWantConfirmesChecks: boolean;
    dataToShow: string[];
    warnDialog: {
      img: string;
      title: string;
      subtitle: string;
      text: string;
      buttonText: string;
    };
  };
}

interface MessageWorkflowStep {
  order: number;
  required: boolean;
  data: {
    title: {
      warn: string;
      sucess: string;
    };
    description: {
      warn: string;
      sucess: string;
    };
    button: {
      warn: string;
      sucess: string;
    };
  };
}
interface ScanQrcodeWorkflowStep {
  order: number;
  active: boolean;
  required: boolean;
  data: {
    img: string;
    title: string;
    subtitle: string;
    qrcodeWasScan: {
      message: string;
    };
  };
}

interface CustomMessages {
  sucessFace: string;
  ocrMessage: string;
  landascapeMessage: string;
}
export interface WorkFlowSteps {
  initial: InitialWorkflowStep;
  liveness: LivenessWorkflowStep;
  register_aditional_data: RegisterAditionalDataWorkflowStep;
  ocr: OcrWorkflowStep;
  show_data: ShowDataWorkflowStep;
  message: MessageWorkflowStep;
  scanQrcode: ScanQrcodeWorkflowStep;
}
export interface SystemConfiguration {
  autoClose: boolean;
  redirectUrl: string;
  apiEndpoints: ApiEndpoints;
  assets: AssetUrls;
  document_type: DocumentType[];
  workflowSteps: WorkFlowSteps;
  customMessages: CustomMessages;
  theme: TypeTheme;
}

export interface ConfigurationType {
  id: number;
  entityId: string;
  systemConfiguration: SystemConfiguration;
  [key: string]: unknown | number | string | boolean | undefined | any;
}

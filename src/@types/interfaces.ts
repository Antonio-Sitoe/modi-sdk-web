export interface IProviderProps {
  id: string
  name: string
  activity_desc: string
  activity_type: number
}

export interface IDocumentType {
  error: boolean
  name: string
  image: string
  similarity: string
  state: number
  numero_documento: string
  document_class_code: string
  data_nascimento: string
  mothername: string
  nationality: string
  sex: string
  height: string
  address: string
  fathersName: string
  marital_status: string
  placeOfBirth: string
  issue_state_name: string
  documentFrontB64: string
  portraitImage64: string
  documentFront: string
  expire_date: string
  issue_date: string
  date_of_birth: string
  issue_state_code: string
  doc_number_field: string
  mrz_string: string
  surname: string
  names: string
  document_number_field: string
  place_issue: string
  documentBackB64: string
  residence_district: string
  documentBack: string
  ocr_id: number
  self: string
}

export interface FaceMatchResult {
  error: boolean
  success: boolean
  status: number
  message: string
  data: {
    detectorType: number
    landmarkType: number
    moreDetails1: {
      pair: number
      similarity: number
    }[]
    moreDetails2: {
      landmarks: string // Consider using a more specific type if possible, e.g., number[][].
      roi: string // Consider using a more specific type if possible, e.g., number[].
      attributes: string // Consider using a more specific type if possible, e.g., object.
    }[]
    fm_id: number
  }
  fm_id: number
}

interface Check {
  isTrue: boolean
  text: string
}

export interface ILoadingProps {
  open: boolean
  title: string
  check1?: Check
  check2?: Check
}

interface ISubscriptionBPINData {
  status: number
  res: boolean
  success: boolean
  matchName: number
  matchBirthDay: boolean
  SUBSCRIBERMOBILEPONE: number
}

export interface ApiResponse {
  success: boolean
  status: number
  data: ISubscriptionBPINData
  message?: string
}

export interface PersonDetailsProps {
  phone_number: string
  first_name: string
  middle_name: string
  last_name: string
  nuit: string
  birth_date: string // ou `Date` se for um objeto de data
  document_number: string
  nutel: string
  document_type: string
  father_name: string
  mother_name: string
  document_class_code: 'Voting_Card' | 'ID' | 'Driving_License' | 'Passport'
}

export type DocumentProps = IDocumentType & PersonDetailsProps

export type IShowTokenType = {
  status: number
  message: string
  data: {
    details: DocumentProps
    selfie: string
  }
}

export enum HttpStatusCode {
  OK = 200,
  PHONE_CANCEL_PROCESS = 215,
  PHONE_GO_TO_OTHER_DEVICE = 217,
  SUBSCRIBER_HAS_FOUNDED = 208,

  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
}

export enum ENUM_DOCUMENT_CLASS_CODE {}

type DocumentCode =
  | 'ID'
  | 'Passport'
  | 'Driving_License'
  | 'DIRE'
  | 'Voting_Card'

export interface DocumentListCodeType {
  id: number
  name: string
  code: DocumentCode | string
}

export enum DYNAMIC_ROUTES {
  INITIAL = 'initial',
  LIVENESS = 'liveness',
  OCR = 'ocr',
  REGISTER = 'register_aditional_data',

  DATA_VALIDATION = 'show_data',

  SCAN_QRCODE = 'scan_qrcode',
  FINAL = 'message',
}

import { DocumentListCodeType } from '@/@types/interfaces'
import { create } from 'zustand'

export type ChannelType = 'phone' | 'tv'

interface CustomFile extends File {
  name: string
  size: number
  type: string
}

export interface IPersonData {
  fileName: string
  file_doc: Blob | null | CustomFile
  failed_fields: Partial<IPersonData>
  similarity: number
  portraitImage64: string
  expire_date: string
  place_issue: string
  front_side: Blob | null
  back_side: Blob | null
  portrait: Blob | null
  attachment: Blob | null
  residence_document: Blob | null
  file_face_code: Blob | null
  selfie: Blob | null
  name: string
  first_name: string
  selfieBase64: string
  middle_name: string
  last_name: string
  phone_number: string
  document_number: string
  email: string
  user_id: number
  nutel: string
  nuit: string
  nuib: string
  serial_number: string
  height: string
  birth_date: string
  father_name: string
  mother_name: string
  has_selfie: number
  marital_status: string
  house_number: string
  nationality: string
  otp_code: string
  born_province_id: number | string
  born_district_id: number | string
  agent: number | string
  born_country_id: string | number
  person_type: number
  document_type_id: number | string
  issue_date: string
  expiration_date: string
  residence_zone: string
  residence_province_id: number
  residence_district_id: string
  gender: number
  physical_address: string
  issuance_date: string
  birthday: string
  register_date: string
  cell_number: string | number
  card_number: string | number
  imsi: number | string
  document_class_code: 'Voting_Card' | 'ID' | 'Driving_License' | 'Passport'
}

interface IResponseBackLiveness {
  nutelfound: boolean
  nutelnotfound: boolean
  validcredencials: boolean
}

interface LoadProps {
  isLoad: boolean
  title?: string
}

interface INDAPROPS {
  isLoading: LoadProps
  provider: string
  personData: IPersonData
  isEmail: 'email' | 'tel'
  hasCompletLivesness: boolean
  hasCompletOCR: boolean
  responseBackLiveness: IResponseBackLiveness
  isOnline: boolean
  fieldsData: string
  listDocumentType: DocumentListCodeType[]
  setfailed_fields: (obj: Partial<IPersonData>) => void
  setSelfie: (blob: Blob) => void
  setIsEmail: (a: 'email' | 'tel') => void
  setName: (name: string) => void
  setPhoneNumber: (phone_number: string) => void
  setDocumentTypeId: (document_type_id: string | number) => void
  setAllData: (all: Partial<IPersonData>) => void
  setSimilarity(sim: number): void
  setSelfieBase64(sim: string): void
  resetAllData(): void
  setIsLoading(load: LoadProps): void
  setFieldsData(fieldsData: string): void
  setHasCompletLiveness(hasCompletLiveness: boolean): void
  setHasCompletOCR(hasCompletOrc: boolean): void
  setListDocumentType(documentType: DocumentListCodeType[]): void
  setIsOnline(isOnline: boolean): void
}

export const useNDAModi = create<INDAPROPS>()((set) => ({
  isLoading: {
    isLoad: false,
    title: '',
  },
  channel: 'phone',
  isEmail: 'tel',
  provider: '',
  hasCompletLivesness: false,
  hasCompletOCR: false,
  listDocumentType: [],
  isAddSubscriber: false,
  isOnline: true,
  personData: {
    fileName: '',
    document_class_code: 'ID',
    expire_date: '',
    failed_fields: {},
    similarity: 0,
    front_side: null,
    file_doc: null,
    back_side: null,
    portrait: null,
    attachment: null,
    residence_document: null,
    portraitImage64: '',
    selfie: null,
    file_face_code: null,
    selfieBase64: '',
    place_issue: '',

    name: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    phone_number: '',
    document_number: '',
    email: '',
    user_id: 1,
    nutel: '',
    nuit: '',
    nuib: '',
    serial_number: '',
    height: '',
    birth_date: '',
    father_name: '',
    mother_name: '',
    has_selfie: 1,
    marital_status: '',
    house_number: '100',
    nationality: '',
    otp_code: '',
    born_province_id: 1000,
    born_district_id: 1001,
    agent: 240000000320655,
    born_country_id: 1,
    person_type: 1,
    document_type_id: 1,
    issue_date: '',
    expiration_date: '',
    residence_zone: '',
    residence_province_id: 10,
    residence_district_id: '',
    gender: 1,

    physical_address: '',
    issuance_date: '',

    register_date: '',
    birthday: '1990-01-01 00:00',
    cell_number: '',
    card_number: '',
    imsi: 123456789,
  },

  responseBackLiveness: {
    nutelfound: false,
    nutelnotfound: false,
    validcredencials: false,
  },

  setIsOnline: (isOnline) =>
    set((state) => ({
      ...state,
      isOnline,
    })),

  setListDocumentType: (listDocumentType) =>
    set((state) => ({
      ...state,
      listDocumentType,
    })),

  setHasCompletLiveness: (hasCompletLivesness) =>
    set((state) => ({ ...state, hasCompletLivesness })),
  setHasCompletOCR: (hasCompletOCR) =>
    set((state) => ({ ...state, hasCompletOCR })),

  fieldsData: '',

  setFieldsData: (data) =>
    set((state) => ({
      ...state,
      fieldsData: data,
    })),

  setIsLoading: (isLoading: LoadProps) =>
    set((state) => ({ ...state, isLoading })),

  setfailed_fields: (field) =>
    set((state) => ({
      personData: {
        ...state.personData,
        failed_fields: field,
      },
    })),

  setSelfieBase64: (field: string) =>
    set((state) => ({
      personData: {
        ...state.personData,
        selfieBase64: field,
      },
    })),

  setSimilarity: (similarity: number) =>
    set((state) => ({
      personData: {
        ...state.personData,
        similarity: similarity,
      },
    })),

  setSelfie: (blob: Blob) =>
    set((state) => ({
      personData: { ...state.personData, selfie: blob, file_face_code: blob },
    })),

  setIsEmail: (isEmail) => set((state) => ({ ...state, isEmail })),

  setName: (name) =>
    set((state) => ({ personData: { ...state.personData, name } })),

  setPhoneNumber: (phone_number) =>
    set((state) => ({ personData: { ...state.personData, phone_number } })),

  setDocumentTypeId: (document_type_id) =>
    set((state) => ({ personData: { ...state.personData, document_type_id } })),

  setAllData: (newData: Partial<IPersonData>) =>
    set((state) => ({
      personData: { ...state.personData, ...newData },
    })),

  resetAllData: () => {
    return set({
      isLoading: {
        isLoad: false,
        title: '',
      },
      isEmail: 'tel',
      provider: '',
      hasCompletLivesness: false,
      hasCompletOCR: false,
      fieldsData: '',
      personData: {
        fileName: '',
        document_class_code: 'ID',
        expire_date: '',
        file_doc: null,
        failed_fields: {},
        similarity: 0,
        front_side: null,
        back_side: null,
        portrait: null,
        attachment: null,
        residence_document: null,
        portraitImage64: '',
        selfie: null,
        file_face_code: null,
        selfieBase64: '',
        place_issue: '',

        name: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        phone_number: '',
        document_number: '',
        email: '',
        user_id: 1,
        nutel: '',
        nuit: '',
        nuib: '',
        serial_number: '',
        height: '',
        birth_date: '',
        father_name: '',
        mother_name: '',
        has_selfie: 1,
        marital_status: '',
        house_number: '100',
        nationality: '',
        otp_code: '',
        born_province_id: 1000,
        born_district_id: 1001,
        agent: 240000000320655,
        born_country_id: 1,
        person_type: 1,
        document_type_id: 1,
        issue_date: '',
        expiration_date: '',
        residence_zone: '',
        residence_province_id: 10,
        residence_district_id: '',
        gender: 1,

        physical_address: '',
        issuance_date: '',
        register_date: '',
        birthday: '1990-01-01 00:00',
        cell_number: '',
        card_number: '',
        imsi: 123456789,
      },
    })
  },
}))

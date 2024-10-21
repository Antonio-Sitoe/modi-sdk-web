import { format } from 'date-fns'
import { useSystem } from '@/contexts/useSystem'
import { useNDAModi } from '@/contexts/step-state'
import { DocumentProps } from '@/@types/interfaces'

import { BASE64toBLOB, formateDateBirth } from '@/utils/general'
import { CheckSubscriberBpin } from '@/actions/client'

export type IApiResponseBpin = {
  status: number
  data: {
    matchBirthDay: boolean
    matchName: number
  }
}

export function useSubscriber() {
  const { setAllData, personData } = useNDAModi()
  const { modiConfig } = useSystem()

  const isBpin = modiConfig.apiEndpoints.bpinSearchEnabled

  async function extractSubscriberData(
    subscriberData: DocumentProps,
    hasSubscriberFoundend: boolean
  ): Promise<{
    nutelfound: boolean
    nutelnotfound: boolean
    validcredencials: boolean
    message?: string
    withoutBpin?: boolean
  }> {
    if (hasSubscriberFoundend) {
      const { birth_date, name } = subscriberhasFounded(subscriberData)
      if (isBpin) {
        return CheckChannel(
          name,
          birth_date,
          hasSubscriberFoundend,
          personData.phone_number
        )
      } else {
        return checkWithoutBpin()
      }
    } else {
      const { birth_date, name } = subscriberNotFounded(subscriberData)
      if (isBpin) {
        return CheckChannel(
          name,
          birth_date,
          hasSubscriberFoundend,
          personData.phone_number
        )
      } else {
        return checkWithoutBpin()
      }
    }
  }
  function checkWithoutBpin() {
    const response = {
      nutelfound: false,
      nutelnotfound: false,
      validcredencials: false,
      withoutBpin: true,
      message: '',
    }
    return response
  }
  async function CheckChannel(
    name: string,
    birth_date: string,
    scanWidthoutOcr: boolean,
    phone_number: string
  ) {
    const response = await verifyPhoneSubscriber(
      name,
      birth_date,
      scanWidthoutOcr,
      phone_number
    )
    return response
  }
  function subscriberNotFounded(details: DocumentProps) {
    const parsedDetails = parseSubscriberDetails(details)
    console.log('[LIVENESS COM OCR]', details)
    console.log('[LIVENESS COM DETAILS]', parsedDetails)
    setAllData(parsedDetails)
    return parsedDetails
  }
  async function verifyPhoneSubscriber(
    name: string,
    birth_date: string,
    scanWidthoutOcr: boolean,
    phone_number: string
  ) {
    const responsebpn = await CheckSubscriberBpin<IApiResponseBpin>({
      birthday: format(birth_date, 'dd-MM-yyyy'),
      cell_number: phone_number,
      config: modiConfig.apiEndpoints.bpin,
      name: name,
    })
    const response = {
      nutelfound: false,
      nutelnotfound: false,
      validcredencials: false,
      message: responsebpn?.message || '',
    }

    const dadosCorespondem =
      responsebpn.data?.status === 201 &&
      responsebpn.data.data.matchBirthDay === true &&
      responsebpn.data.data.matchName >= 50

    if (responsebpn.error) {
      console.log('ERRO NAO ESTA', responsebpn.error)

      response.validcredencials = true
    } else if (dadosCorespondem) {
      if (scanWidthoutOcr) {
        response.nutelfound = true
      } else {
        response.nutelnotfound = true
      }
    } else {
      response.validcredencials = true
    }
    return response
  }
  function subscriberhasFounded(details: DocumentProps) {
    console.log('[LIVENESS sem OCR]', details)
    const name = `${details.first_name} ${details.middle_name} ${details.last_name}`
    const birthdayDate = formateDateBirth(details.birth_date)
    setAllData({
      document_type_id: details.document_type,
      document_number: details.document_number,
      birth_date: birthdayDate,
      first_name: details.first_name,
      middle_name: details.middle_name,
      last_name: details.last_name,
      nutel: details.nutel,
      mother_name: details.mother_name,
      father_name: details.father_name,
      document_class_code: details?.document_class_code || 'ID',
    })
    return {
      name,
      birth_date: birthdayDate,
    }
  }
  function parseSubscriberDetails(details: DocumentProps) {
    const middle_name = details.names?.split(' ') ?? ['', '']
    const portrait = details.portraitImage64
      ? BASE64toBLOB(details.portraitImage64)
      : personData.portrait
    const attachment = details.documentFrontB64
      ? BASE64toBLOB(details.documentFrontB64)
      : personData.attachment
    const selfie = details.self ? BASE64toBLOB(details.self) : personData.selfie
    const residence_document = details.documentBackB64
      ? BASE64toBLOB(details.documentBackB64)
      : personData.residence_document
    const front_side = details.documentFrontB64
      ? BASE64toBLOB(details.documentFrontB64)
      : personData.front_side
    const back_side = details.documentBackB64
      ? BASE64toBLOB(details.documentBackB64)
      : personData.back_side

    const similarityDetail = details.similarity

    // Verifica se similarity é um número ou pode ser convertido para número
    const parsedSimilarity = isNaN(Number(similarityDetail))
      ? 0
      : Number(similarityDetail)

    // Converte para uma porcentagem e formata com duas casas decimais
    const similarity = parseFloat((parsedSimilarity * 100).toFixed(2))

    return {
      front_side,
      back_side,
      similarity,
      selfieBase64: details.self ? details.self : personData.selfieBase64,
      selfie,
      place_issue: details.place_issue,
      portraitImage64: details.portraitImage64
        ? details.portraitImage64
        : personData.portraitImage64,
      name: details.name,
      first_name: middle_name[0],
      last_name: details.surname,
      document_number: details.document_number_field,
      height: details.height,
      birth_date: details.data_nascimento,
      father_name: details.fathersName,
      mother_name: details.mothername,
      nationality: details.nationality,
      residence_zone: details.address,
      issue_date: details.issue_date,
      expiration_date: details.expire_date,
      born_district_id: details.placeOfBirth,
      born_province_id: details.placeOfBirth,
      born_country_id: details.nationality,
      marital_status: details.marital_status,
      gender: details.sex === 'M' ? 1 : 2,
      portrait,
      attachment,
      residence_document,
      middle_name: middle_name[1] ? middle_name[1] : middle_name[0],
      residence_district_id: details.residence_district,
      document_class_code: details?.document_class_code || 'ID',
    }
  }
  return { extractSubscriberData, CheckChannel }
}

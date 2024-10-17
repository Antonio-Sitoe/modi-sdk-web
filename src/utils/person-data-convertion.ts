import { IPersonData } from '@/contexts/step-state';
import { capitalizeString, converteDate, validateData } from './general';

export function convertToFormData(personData: IPersonData): FormData {
  const formData = new FormData();
  if (personData?.front_side)
    formData.set('front_side', personData?.front_side, 'front_side.jpg');
  if (personData?.back_side)
    formData.set('back_side', personData?.back_side, 'back_side.jpg');
  if (personData?.portrait)
    formData.set('portrait', personData?.portrait, 'portrait.jpg');
  if (personData?.attachment)
    formData.set('attachment', personData?.attachment, 'attachment.jpg');

  if (personData?.residence_document)
    formData.set(
      'residence_document',
      personData?.residence_document,
      'residence_document.jpg',
    );
  if (personData?.selfie)
    formData.set('file_face_code', personData?.selfie, 'fileFaceCode.jpg');

  if (personData?.selfie)
    formData.set('selfie', personData?.selfie, 'selfie.jpg');

  formData.set('similarity', personData?.similarity.toString());
  formData.set('failed_fields', JSON.stringify(personData?.failed_fields));
  formData.set('name', personData?.name);
  formData.set('document_class_code', personData?.document_class_code);
  formData.set('first_name', personData?.first_name);
  formData.set('middle_name', personData?.middle_name);
  formData.set('last_name', personData?.last_name);
  formData.set('phone_number', personData?.phone_number);
  formData.set('document_number', personData?.document_number);
  formData.set('email', personData?.email);
  formData.set('user_id', `${personData?.user_id}`);
  formData.set('nutel', personData?.nutel);
  formData.set('nuit', personData?.nuit);
  formData.set('nuib', personData?.nuib);
  formData.set('serial_number', personData?.serial_number);
  formData.set('height', personData?.height);
  formData.set('birth_date', personData?.birth_date);
  formData.set('father_name', personData?.father_name);
  formData.set('mother_name', personData?.mother_name);
  formData.set('has_selfie', `${personData?.has_selfie}`);
  formData.set('marital_status', personData?.marital_status);
  formData.set('house_number', personData?.house_number);
  formData.set('nationality', personData?.nationality);

  formData.set('born_province_id', `${personData?.born_province_id}`);
  formData.set('born_district_id', `${personData?.born_district_id}`);
  formData.set('agent', `${personData?.agent}`);
  formData.set('born_country_id', `${personData?.born_country_id}`);
  formData.set('person_type', `${personData?.person_type}`);
  formData.set('document_type_id', `${personData?.document_type_id}`);
  formData.set('issue_date', personData?.issue_date);
  formData.set('expiration_date', personData?.expiration_date);
  formData.set('expire_date', personData?.expiration_date);
  formData.set('residence_zone', personData?.residence_zone);
  formData.set('residence_province_id', `${personData?.residence_province_id}`);
  formData.set('residence_district_id', personData?.residence_district_id);
  formData.set('gender', `${personData?.gender}`);
  formData.set('physical_address', personData?.physical_address);
  formData.set('issuance_date', personData?.issuance_date);
  formData.set('register_date', personData?.register_date);
  formData.set('cell_number', `${personData?.cell_number}`);
  formData.set('card_number', `${personData?.card_number}`);
  formData.set('imsi', `${personData?.imsi}`);

  return formData;
}

export function transformeDataToArray(
  personData: IPersonData,
  dataToShowList: string[],
) {
  const issueDate = converteDate(personData?.issue_date);
  const expirationDate = converteDate(personData?.expiration_date);
  const birth_date = converteDate(personData?.birth_date);

  const document_number = validateData(personData?.document_number);
  const name = validateData(capitalizeString(personData?.name));
  const birthdate = validateData(birth_date);
  const born_province_id = validateData(
    capitalizeString(String(personData?.born_province_id)),
  );
  const residence_zone = validateData(
    capitalizeString(personData?.residence_zone),
  );
  const residence_district_id = validateData(
    capitalizeString(personData?.residence_district_id),
  );
  const place_issue = validateData(capitalizeString(personData?.place_issue));
  const nationality = validateData(capitalizeString(personData?.nationality));
  const dataToShow = [
    {
      name: 'document_number',
      label: 'Número do documento',
      value: document_number,
    },
    {
      name: 'name',
      label: 'Nome',
      value: name,
    },
    {
      name: 'birth_date',
      label: 'Data de nascimento',
      value: birthdate,
    },

    {
      name: 'born_province_id',
      label: 'Distrito de Nascimento',
      value: born_province_id,
    },
    {
      name: 'residence_zone',
      label: 'Endereço',
      value: residence_zone,
    },

    {
      name: 'residence_district_id',
      label: 'Distrito de residência',
      value: residence_district_id,
    },

    {
      name: 'place_issue',
      label: 'Local de emissão',
      value: place_issue,
    },
    {
      name: 'gender',
      label: 'Gênero',
      value: personData?.gender === 1 ? 'Masculino' : 'Feminino',
    },
    {
      name: 'nationality',
      label: 'País',
      value: nationality,
    },
    {
      name: 'issueDate',
      label: 'Data de emissão',
      value: issueDate,
    },
    {
      name: 'expirationDate',
      label: 'Data de expiração',
      value: expirationDate,
    },
  ];
  return dataToShow.filter(({ name }) => dataToShowList.includes(name));
}

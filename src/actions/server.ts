import { ConfigurationType } from '@/@types/types';
import { api } from '@/lib/axios';

export async function getCompanySettings(companyId: string) {
  try {
    const { data } = await api.get<ConfigurationType[]>(
      `/config?entityId=${companyId}`,
    );
    if (data.length) {
      return { data: data[0].systemConfiguration, error: null };
    } else {
      throw new Error('Falha ao buscar esses dados');
    }
  } catch (error) {
    console.error(error);
    return { data: null, error };
  }
}

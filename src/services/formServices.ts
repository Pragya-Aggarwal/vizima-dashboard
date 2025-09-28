import axios from 'axios';
import { FormData, FormListResponse, FormResponse } from '@/types/form';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.vizima.in';

export const getForms = async (params?: { page?: number; limit?: number }) => {
  const response = await axios.get<FormListResponse>(`${API_URL}/api/forms`, {
    params,
    withCredentials: true,
  });
  return response.data;
};

export const getFormById = async (id: string) => {
  const response = await axios.get<FormResponse>(`${API_URL}/api/forms/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

export const deleteForm = async (id: string) => {
  const response = await axios.delete(`${API_URL}/api/forms/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

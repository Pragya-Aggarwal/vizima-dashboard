import api from "../lib/axiosInstance";

export const getContacts = async (params: { page?: number; limit?: number } = {}) => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());
  
  const response = await api.get(`/api/contact-numbers?${queryParams.toString()}`);
  return response.data;
};

export const getContactById = async (id: string) => {
  const response = await api.get(`/api/contact-numbers/${id}`);
  return response.data;
};

export const createContact = async (data: any) => {
  const response = await api.post('/api/contact-numbers', data);
  return response.data;
};

export const updateContact = async (id: string, data: any) => {
  const response = await api.patch(`/api/contact-numbers/${id}`, data);
  return response.data;
};

export const deleteContact = async (id: string) => {
  const response = await api.delete(`/api/contact-numbers/${id}`);
  return response.data;
};

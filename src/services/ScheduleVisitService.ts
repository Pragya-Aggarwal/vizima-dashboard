import api from '../lib/axiosInstance';

export interface ScheduleVisit {
  _id: string;
  userId: string;
  propertyId: string;
  propertyName: string;
  visitDate: string;
  visitTime: string;
  date?: string; // Added for compatibility
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  fullName?: string; // Added for compatibility
  email?: string; // Added for compatibility
  sharing?: string; // Added for compatibility
  gender?: string;
  phone?: string;
  mode?: string;
  microSiteLink?: string;
}

export interface GetScheduleVisitsParams {
  page?: number;
  limit?: number;
  status?: string;
  propertyId?: string;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getScheduleVisits = async (params: GetScheduleVisitsParams = {}): Promise<PaginatedResponse<ScheduleVisit>> => {
  const response = await api.get('/api/schedule-visits', { params });
  return response.data;
};

export const getScheduleVisitById = async (id: string): Promise<ScheduleVisit> => {
  const response = await api.get(`/api/schedule-visits/${id}`);
  return response.data;
};

export interface UpdateScheduleVisitData {
  propertyId?: string;
  visitDate?: string;
  visitTime?: string;
  date?: string; // Added for compatibility
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  gender?: string;
  sharing?: string;
  propertyName?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  mode?: string;
}

export const updateScheduleVisit = async (id: string, data: UpdateScheduleVisitData): Promise<ScheduleVisit> => {
  const response = await api.put(`/api/schedule-visits/${id}`, data);
  return response.data;
};

export const deleteScheduleVisit = async (id: string): Promise<void> => {
  const response = await api.delete(`/api/schedule-visits/${id}`);
  return response.data;
};

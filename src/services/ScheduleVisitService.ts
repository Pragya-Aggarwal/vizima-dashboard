import api from '../lib/axiosInstance';

export interface ScheduleVisit {
  id: string;
  userId: string;
  propertyId: string;
  propertyName: string;
  visitDate: string;
  visitTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  property: {
    id: string;
    name: string;
    address: string;
    city: string;
  };
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

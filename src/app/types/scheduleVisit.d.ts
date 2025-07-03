export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
}

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
  user: User;
  property: Property;
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

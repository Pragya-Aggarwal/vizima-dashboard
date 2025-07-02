export interface Banner {
  _id: string;
  title: string;
  description: string;
  image: string;
  isActive: boolean;
  order: number;
  type: string;
  targetAudience: string;
  displayLocation: string[];
  startDate: string;
  endDate: string;
  link: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BannerListResponse {
  data: Banner[];
  page: number;
  total: number;
  totalPages: number;
}

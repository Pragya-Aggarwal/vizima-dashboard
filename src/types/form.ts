export interface FormData {
  _id?: string; // Make optional since it might not be present in all responses
  name: string;
  phone: string;
  location: string;
  pgType: 'male' | 'female' | 'unisex' | 'transgender'; // Add specific types if there are more possible values
  email?: string; // Make optional since it's not in the example
  message?: string; // Make optional since it's not in the example
  createdAt?: string; // Make optional since it might not be present in all responses
  updatedAt?: string; // Make optional since it might not be present in all responses
  __v?: number; // Make optional since it might not be present in all responses
}

export interface FormListResponse {
  data: FormData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FormResponse {
  data: FormData;
}

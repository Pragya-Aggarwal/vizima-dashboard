import api from '../lib/axiosInstance';

export interface SpamReport {
    _id: string;
    name: string;
    email: string;
    phone: string;
    city: string;
    status: string;
    confidence: number;
    reasons: string[];
    detectedAt: string;
    source: string;
}

export interface GetSpamReportsParams {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
}

export interface PaginatedSpamReports {
    data: SpamReport[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export const getSpamReports = async (params: GetSpamReportsParams = {}): Promise<PaginatedSpamReports> => {
    const response = await api.get('/api/spam/reports', { params });
    return response.data;
}; 
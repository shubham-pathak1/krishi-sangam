import api, { handleApiError } from './api';
import type { ApiResponse } from '../types/auth.types';
import type { CompanyDetails, CreateCompanyRequest, UpdateCompanyRequest } from '../types/company.types';

// Create Company Profile
export const createCompany = async (data: CreateCompanyRequest): Promise<CompanyDetails> => {
    try {
        const response = await api.post<ApiResponse<CompanyDetails>>('/companies/', data);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to create company profile');
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

// Get Company by ID
export const getCompanyById = async (id: string): Promise<CompanyDetails> => {
    try {
        const response = await api.get<ApiResponse<CompanyDetails>>(`/companies/${id}`);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch company profile');
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

// Update Company
export const updateCompany = async (id: string, data: UpdateCompanyRequest): Promise<CompanyDetails> => {
    try {
        const response = await api.put<ApiResponse<CompanyDetails>>(`/companies/${id}`, data);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to update company profile');
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

// Get All Companies (Admin only)
export const getAllCompanies = async (): Promise<CompanyDetails[]> => {
    try {
        const response = await api.get<ApiResponse<CompanyDetails[]>>('/companies/');
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch companies');
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

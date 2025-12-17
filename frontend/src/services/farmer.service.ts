import api, { handleApiError } from './api';
import type { ApiResponse } from '../types/auth.types';
import type { FarmerDetails, CreateFarmerRequest, UpdateFarmerRequest } from '../types/farmer.types';

// Create Farmer Profile
export const createFarmer = async (data: CreateFarmerRequest): Promise<FarmerDetails> => {
    try {
        const response = await api.post<ApiResponse<FarmerDetails>>('/farmers/', data);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to create farmer profile');
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

// Get Farmer by ID
export const getFarmerById = async (id: string): Promise<FarmerDetails> => {
    try {
        const response = await api.get<ApiResponse<FarmerDetails>>(`/farmers/${id}`);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch farmer profile');
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

// Update Farmer
export const updateFarmer = async (id: string, data: UpdateFarmerRequest): Promise<FarmerDetails> => {
    try {
        const response = await api.put<ApiResponse<FarmerDetails>>(`/farmers/${id}`, data);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to update farmer profile');
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

// Get All Farmers (Admin only)
export const getAllFarmers = async (): Promise<FarmerDetails[]> => {
    try {
        const response = await api.get<ApiResponse<FarmerDetails[]>>('/farmers/');
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch farmers');
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

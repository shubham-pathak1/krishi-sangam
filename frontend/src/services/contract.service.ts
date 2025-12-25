import api, { handleApiError } from './api';
import type { Contract, CreateContractTransactionRequest } from '../types/contract.types';
import type { ApiResponse } from '../types/auth.types';
import type { FarmerDetails } from '../types/farmer.types';

// Get All Contracts
export const getAllContracts = async (): Promise<Contract[]> => {
    try {
        const response = await api.get<ApiResponse<Contract[]>>('/contracts/');
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch contracts');
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

// Update Contract Status
export const updateContract = async (id: string, data: { status: boolean }): Promise<Contract> => {
    try {
        const response = await api.put<ApiResponse<Contract>>(`/contracts/${id}`, data);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to update contract');
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

// Delete Contract
export const deleteContract = async (id: string): Promise<void> => {
    try {
        const response = await api.delete<ApiResponse<null>>(`/contracts/${id}`);
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to delete contract');
        }
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

// Get Farmer by Phone
export const getFarmerByPhone = async (phone: string): Promise<FarmerDetails[]> => {
    try {
        const response = await api.get<ApiResponse<FarmerDetails[]>>(`/farmers/?phone=${phone}`);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch farmer');
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

// Create Contract Transaction
export const createContractTransaction = async (data: CreateContractTransactionRequest): Promise<void> => {
    try {
        await api.post<ApiResponse<null>>('/contract-transactions', data);
        // Note: The API might just return 201 Created without body or success flag in some cases, 
        // but assuming consistent successful response wrapper.
        // If response.data is empty/null, axios still returns response object.
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

const contractService = {
    getAllContracts,
    updateContract,
    deleteContract,
    getFarmerByPhone,
    createContractTransaction,
};

export default contractService;

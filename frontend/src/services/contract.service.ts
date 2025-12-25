// Contract service for API calls
import type { Contract } from '../types/contract.types';

const API_BASE_URL = 'http://localhost:8000/api/v1';

interface ApiResponse<T> {
    statusCode: number;
    data: T;
    message: string;
    success?: boolean;
}

interface UpdateContractRequest {
    status?: boolean;
}

interface ContractTransactionRequest {
    contract_id: string;
    farmer_id: string;
    company_id: string;
    status: string;
    payment_type: string;
}

const contractService = {
    // Get all contracts
    getAllContracts: async (): Promise<Contract[]> => {
        const response = await fetch(`${API_BASE_URL}/contracts/`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch contracts');
        }

        const result: ApiResponse<Contract[]> = await response.json();
        return result.data;
    },

    // Get contract by ID
    getContractById: async (id: string): Promise<Contract> => {
        const response = await fetch(`${API_BASE_URL}/contracts/${id}`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch contract');
        }

        const result: ApiResponse<Contract> = await response.json();
        return result.data;
    },

    // Update contract
    updateContract: async (id: string, data: UpdateContractRequest): Promise<Contract> => {
        const response = await fetch(`${API_BASE_URL}/contracts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to update contract');
        }

        const result: ApiResponse<Contract> = await response.json();
        return result.data;
    },

    // Delete contract
    deleteContract: async (id: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/contracts/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to delete contract');
        }
    },

    // Get farmer by phone
    getFarmerByPhone: async (phone: string): Promise<{ _id: string }[]> => {
        const response = await fetch(`${API_BASE_URL}/farmers/?phone=${encodeURIComponent(phone)}`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch farmer');
        }

        const result: ApiResponse<{ _id: string }[]> = await response.json();
        return result.data;
    },

    // Create contract transaction
    createContractTransaction: async (data: ContractTransactionRequest): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/contract-transactions/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to create contract transaction');
        }
    },
};

export default contractService;


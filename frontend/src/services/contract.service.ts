// Contract service for API calls
import type { Contract } from '../types/contract.types';

const API_BASE_URL = 'http://localhost:8000/api/v1';

interface ApiResponse<T> {
    statusCode: number;
    data: T;
    message: string;
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
};

export default contractService;

import api, { handleApiError } from './api';
import type { Transaction, UpdateTransactionRequest } from '../types/transaction.types';

interface ApiResponse<T> {
    statusCode: number;
    data: T;
    message: string;
    success?: boolean;
}

const transactionService = {
    // Get all transactions
    getAllTransactions: async (): Promise<Transaction[]> => {
        try {
            const response = await api.get<ApiResponse<Transaction[]>>('/contract-transactions');
            return response.data.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Update transaction
    updateTransaction: async (id: string, data: UpdateTransactionRequest): Promise<Transaction> => {
        try {
            const response = await api.put<ApiResponse<Transaction>>(`/contract-transactions/${id}`, data);
            return response.data.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Delete transaction
    deleteTransaction: async (id: string): Promise<void> => {
        try {
            await api.delete<ApiResponse<null>>(`/contract-transactions/${id}`);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },
};

export default transactionService;

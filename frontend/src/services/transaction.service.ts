// Transaction service for API calls
import type { Transaction, UpdateTransactionRequest } from '../types/transaction.types';

const API_BASE_URL = 'http://localhost:8000/api/v1';

interface ApiResponse<T> {
    statusCode: number;
    data: T;
    message: string;
    success?: boolean;
}

const transactionService = {
    // Get all transactions
    getAllTransactions: async (): Promise<Transaction[]> => {
        const response = await fetch(`${API_BASE_URL}/contract-transactions`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch transactions');
        }

        const result: ApiResponse<Transaction[]> = await response.json();
        return result.data;
    },

    // Update transaction
    updateTransaction: async (id: string, data: UpdateTransactionRequest): Promise<Transaction> => {
        const response = await fetch(`${API_BASE_URL}/contract-transactions/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to update transaction');
        }

        const result: ApiResponse<Transaction> = await response.json();
        return result.data;
    },

    // Delete transaction
    deleteTransaction: async (id: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/contract-transactions/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to delete transaction');
        }
    },
};

export default transactionService;

// Admin service for API calls
import type { AdminCounts, AdminProfile } from '../types/admin.types';

const API_BASE_URL = 'http://localhost:8000/api/v1';

interface ApiResponse<T> {
    statusCode: number;
    data: T;
    message: string;
}

const adminService = {
    // Get dashboard counts (farmers, companies, contracts)
    getCounts: async (): Promise<AdminCounts> => {
        try {
            const response = await fetch(`${API_BASE_URL}/admins/count/`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('getCounts error:', response.status, errorText);
                throw new Error(`Failed to fetch counts (${response.status})`);
            }

            const result: ApiResponse<AdminCounts> = await response.json();
            return result.data;
        } catch (error) {
            console.error('getCounts exception:', error);
            throw error;
        }
    },

    // Get admin profile by phone
    getAdminByPhone: async (phone: string): Promise<AdminProfile> => {
        const response = await fetch(`${API_BASE_URL}/admins/?phone=${phone}`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch admin profile');
        }

        const result: ApiResponse<AdminProfile> = await response.json();
        return result.data;
    },

    // Get all admins
    getAllAdmins: async (): Promise<AdminProfile[]> => {
        const response = await fetch(`${API_BASE_URL}/admins/`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch admins');
        }

        const result: ApiResponse<AdminProfile[]> = await response.json();
        return result.data;
    },
};

export default adminService;

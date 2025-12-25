// Admin service for API calls
import api, { handleApiError } from './api';
import type { AdminCounts, AdminProfile } from '../types/admin.types';

interface ApiResponse<T> {
    statusCode: number;
    data: T;
    message: string;
}

const adminService = {
    // Get dashboard counts (farmers, companies, contracts)
    getCounts: async (): Promise<AdminCounts> => {
        try {
            const response = await api.get<ApiResponse<AdminCounts>>('/admins/count/');
            return response.data.data;
        } catch (error) {
            console.error('getCounts exception:', error);
            throw new Error(handleApiError(error));
        }
    },

    // Get admin profile by phone
    getAdminByPhone: async (phone: string): Promise<AdminProfile> => {
        try {
            const response = await api.get<ApiResponse<AdminProfile>>(`/admins/?phone=${phone}`);
            return response.data.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Get all admins
    getAllAdmins: async (): Promise<AdminProfile[]> => {
        try {
            const response = await api.get<ApiResponse<AdminProfile[]>>('/admins/');
            return response.data.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },
};

export default adminService;

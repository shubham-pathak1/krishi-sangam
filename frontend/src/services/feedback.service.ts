import api from './api';

export interface FeedbackData {
    name: string;
    email: string;
    phone: string;
    message: string;
    date?: string;
}

export interface FeedbackResponse {
    id: string;
    message: string;
    success: boolean;
}

export const feedbackService = {
    submitFeedback: async (data: FeedbackData): Promise<FeedbackResponse> => {
        const feedbackData = {
            ...data,
            date: new Date().toISOString().split('T')[0],
        };

        const response = await api.post('/feedbacks/', feedbackData);
        return response.data;
    },
};

export default feedbackService;

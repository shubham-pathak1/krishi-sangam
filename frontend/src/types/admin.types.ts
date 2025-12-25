// Admin types

export interface AdminCounts {
    Farmers: number;
    Companies: number;
    'Active Contracts': number;
    'Completed Contracts': number;
}

export interface AdminProfile {
    _id: string;
    name: string;
    email: string;
    address: string;
    phone: number;
    dob: string;
    createdAt: string;
    updatedAt: string;
}

// User Category Types
export type UserCategory = 'Farmer' | 'Company' | 'Admin';

// User Model
export interface User {
  _id: string;
  Category: UserCategory;
  Email?: string;
  Phone_no?: number;
  Name: string;
  isactive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Farmer Model
export interface Farmer {
  _id: string;
  name: string;
  email: string;
  address: string;
  land_size: number;
  phone_no: number;
  id_proof: string;
  survey_no: string;
  crop_one: string;
  crop_two: string;
  createdAt: string;
  updatedAt: string;
}

// Company Model
export interface Company {
  _id: string;
  company_name: string;
  email: string;
  address: string;
  phone_no: number;
  gstin: string;
  createdAt: string;
  updatedAt: string;
}

// Admin Model
export interface Admin {
  _id: string;
  name: string;
  email: string;
  address: string;
  phone: number;
  dob: string;
  createdAt: string;
  updatedAt: string;
}

// Auth Request/Response Types
export interface RegisterRequest {
  Category: UserCategory;
  Email?: string;
  Phone_no?: number;
  Name: string;
  password: string;
}

export interface LoginRequest {
  Email?: string;
  Phone_no?: number;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T = any> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

// Auth Context State
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}
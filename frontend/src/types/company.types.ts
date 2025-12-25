// Company Registration Details Types

export interface CompanyDetails {
    _id: string;
    company_name: string;
    email: string;
    address: string;
    phone_no: number | string;
    gstin: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCompanyRequest {
    company_name: string;
    email: string;
    address: string;
    phone_no: number | string;
    gstin: string;
}

export interface UpdateCompanyRequest {
    company_name?: string;
    address?: string;
    phone_no?: number | string;
    gstin?: string;
}


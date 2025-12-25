// Transaction types

export interface Transaction {
    _id: string;
    contract_id: string;
    company_id: string;
    farmer_id: string;
    status: boolean | string;
    payment_type: string;
    payment_id?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface UpdateTransactionRequest {
    contract_id?: string;
    company_id?: string;
    farmer_id?: string;
    status?: boolean | string;
    payment_type?: string;
    payment_id?: string;
}

// Contract types

export interface Contract {
    _id: string;
    company_id: string;
    product: string;
    quantity: string | number;
    duration: string;
    place: string;
    price: string | number;
    status: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateContractTransactionRequest {
    contract_id: string;
    farmer_id: string;
    company_id: string;
    status: string; // 'true' | 'false' or '0' | '1' based on backend
    payment_type: string;
    payment_id?: string;
}

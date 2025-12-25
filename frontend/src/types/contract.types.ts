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

// Farmer Registration Details Types

export interface FarmerDetails {
  _id: string;
  name: string;
  email: string;
  address: string;
  land_size: number;
  phone_no: number | string;
  id_proof: string;
  survey_no: string;
  crop_one: string;
  crop_two: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFarmerRequest {
  name: string;
  email: string;
  address: string;
  land_size: number;
  phone_no: number | string;
  id_proof: string;
  survey_no: string;
  crop_one: string;
  crop_two: string;
}

export interface UpdateFarmerRequest {
  name?: string;
  address?: string;
  land_size?: number;
  phone_no?: number | string;
  id_proof?: string;
  survey_no?: string;
}


import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Company } from "../models/company.models.js";

// Create Company
const createCompany = asyncHandler(async (req, res) => {
    const { company_name, email, address, phone_no, gstin } = req.body;

    if ([company_name, email, address, phone_no, gstin].some((field) => !field?.trim())) {
        throw new ApiError(400, "All fields are required");
    }

    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
        throw new ApiError(409, "Company with this email already exists");
    }

    const company = await Company.create({ company_name, email, address, phone_no, gstin });

    if (!company) {
        throw new ApiError(500, "Failed to create company");
    }

    res.status(201).json(new ApiResponse(201, company, "Company created successfully"));
});

// Get all Companies
const getAllCompanies = asyncHandler(async (req, res) => {
    const admins = await Company.find();
    res.status(200).json(new ApiResponse(200, admins, "Companies fetched successfully"));
});

// Get Company by ID
const getCompanyById = asyncHandler(async (req, res) => {
    const company = await Company.findById(req.params.id);

    if (!company) {
        throw new ApiError(404, "Company not found");
    }

    res.status(200).json(new ApiResponse(200, company, "Company fetched successfully"));
});

// Update Company
const updateCompany = asyncHandler(async (req, res) => {
    const { company_name, address, phone_no, gstin } = req.body;

    const company = await Company.findByIdAndUpdate(
        req.params.id,
        { company_name, address, phone_no, gstin },
        { new: true }
    );

    if (!company) {
        throw new ApiError(404, "Company not found");
    }

    res.status(200).json(new ApiResponse(200, company, "Company updated successfully"));
});

// Delete Company
const deleteCompany = asyncHandler(async (req, res) => {
    const company = await Company.findByIdAndDelete(req.params.id);

    if (!company) {
        throw new ApiError(404, "Company not found");
    }

    res.status(200).json(new ApiResponse(200, null, "Company deleted successfully"));
});

export { createCompany, getAllCompanies, getCompanyById, updateCompany, deleteCompany };

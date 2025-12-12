import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Admin } from "../models/admin.models.js";

// Create Admin
const createAdmin = asyncHandler(async (req, res) => {
    const { name, email, address, phone, dob } = req.body;

    if ([name, email, address, phone, dob].some((field) => !field?.trim())) {
        throw new ApiError(400, "All fields are required");
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
        throw new ApiError(409, "Admin with this email already exists");
    }

    const admin = await Admin.create({ name, email, address, phone, dob });

    if (!admin) {
        throw new ApiError(500, "Failed to create admin");
    }

    res.status(201).json(new ApiResponse(201, admin, "Admin created successfully"));
});

// Get all Admins
const getAllAdmins = asyncHandler(async (req, res) => {
    const admins = await Admin.find();
    res.status(200).json(new ApiResponse(200, admins, "Admins fetched successfully"));
});

// Get Admin by ID
const getAdminById = asyncHandler(async (req, res) => {
    const phone = req.params.phone;
    const admin = await Admin.findOne({phone: phone});

    if (!admin) {
        throw new ApiError(404, "Admin not found");
    }

    res.status(200).json(new ApiResponse(200, admin, "Admin fetched successfully"));
});

// Update Admin
const updateAdmin = asyncHandler(async (req, res) => {
    const { name, address, phone, dob } = req.body;

    const admin = await Admin.findByIdAndUpdate(
        req.params.id,
        { name, address, phone, dob },
        { new: true }
    );

    if (!admin) {
        throw new ApiError(404, "Admin not found");
    }

    res.status(200).json(new ApiResponse(200, admin, "Admin updated successfully"));
});

// Delete Admin
const deleteAdmin = asyncHandler(async (req, res) => {
    const admin = await Admin.findByIdAndDelete(req.params.id);

    if (!admin) {
        throw new ApiError(404, "Admin not found");
    }

    res.status(200).json(new ApiResponse(200, null, "Admin deleted successfully"));
});

export { createAdmin, getAllAdmins, getAdminById, updateAdmin, deleteAdmin };

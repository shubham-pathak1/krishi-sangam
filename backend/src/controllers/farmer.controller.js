import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Farmer } from "../models/farmer.models.js";

// Create Farmer
const createFarmer = asyncHandler(async (req, res) => {
  const { name, email, address, land_size, phone_no, id_proof, survey_no, crop_one, crop_two } = req.body;

  if ([name, email, address, land_size, phone_no, id_proof, survey_no, crop_one, crop_two].some((field) => !field)) {
    throw new ApiError(400, "All fields are required");
  }

  const existingFarmer = await Farmer.findOne({ email });
  if (existingFarmer) {
    throw new ApiError(409, "Farmer with this email already exists");
  }

  const farmer = await Farmer.create({ name, email, address, land_size, phone_no, id_proof, survey_no, crop_one, crop_two});

  if (!farmer) {
    throw new ApiError(500, "Failed to create farmer");
  }

  res.status(201).json(new ApiResponse(201, farmer, "Farmer created successfully"));
});

// Get all Farmers
const getAllFarmers = asyncHandler(async (req, res) => {
  const farmers = await Farmer.find();
  res.status(200).json(new ApiResponse(200, farmers, "Farmers fetched successfully"));
});

// Get Farmer by ID
const getFarmerById = asyncHandler(async (req, res) => {
  const farmer = await Farmer.findById(req.params.id);

  if (!farmer) {
    throw new ApiError(404, "Farmer not found");
  }

  res.status(200).json(new ApiResponse(200, farmer, "Farmer fetched successfully"));
});

// Update Farmer
const updateFarmer = asyncHandler(async (req, res) => {
  const { name, address, land_size, phone_no, id_proof, survey_no } = req.body;

  const farmer = await Farmer.findByIdAndUpdate(
    req.params.id,
    { name, address, land_size, phone_no, id_proof, survey_no },
    { new: true }
  );

  if (!farmer) {
    throw new ApiError(404, "Farmer not found");
  }

  res.status(200).json(new ApiResponse(200, farmer, "Farmer updated successfully"));
});

// Delete Farmer
const deleteFarmer = asyncHandler(async (req, res) => {
  const farmer = await Farmer.findByIdAndDelete(req.params.id);

  if (!farmer) {
    throw new ApiError(404, "Farmer not found");
  }

  res.status(200).json(new ApiResponse(200, null, "Farmer deleted successfully"));
});

export { createFarmer, getAllFarmers, getFarmerById, updateFarmer, deleteFarmer };

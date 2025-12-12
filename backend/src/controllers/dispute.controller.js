import mongoose from "mongoose";
import { Dispute } from "../models/dispute.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

//Create a Dispute
const createDispute = asyncHandler(async (req, res) => {
    const { name, email, id, userCat, admin_id, phone, raised_date, resolution_date, dispute_details, status, outcome } = req.body;

    if (![name, email, id, userCat, admin_id, phone, raised_date, resolution_date, dispute_details, status, outcome].every(Boolean)) {
        throw new ApiError(400, "All fields are required");
    }

    const adminObjectId = new mongoose.Types.ObjectId(String(admin_id));

    const dispute = await Dispute.create({
        name,
        email,
        id,
        userCat,
        admin_id: adminObjectId,
        phone,
        raised_date,
        resolution_date,
        dispute_details,
        status,
        outcome
    });

    res.status(201).json(new ApiResponse(201, dispute, "Dispute created successfully"));
});

// Get all Disputes
const getAllDisputes = asyncHandler(async (req, res) => {
    const disputes = await Dispute.find();
    res.status(200).json(new ApiResponse(200, disputes, "Fetched all disputes"));
});

// Get Dispute by ID
const getDisputeById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const dispute = await Dispute.findById(id);
    if (!dispute) {
        throw new ApiError(404, "Dispute not found");
    }

    res.status(200).json(new ApiResponse(200, dispute, "Fetched dispute successfully"));
});

// Update Dispute
const updateDispute = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const dispute = await Dispute.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!dispute) {
        throw new ApiError(404, "Dispute not found");
    }

    res.status(200).json(new ApiResponse(200, dispute, "Dispute updated successfully"));
});

// Delete a Dispute
const deleteDispute = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const dispute = await Dispute.findByIdAndDelete(id);
    if (!dispute) {
        throw new ApiError(404, "Dispute not found");
    }

    res.status(200).json(new ApiResponse(200, null, "Dispute deleted successfully"));
});

export { createDispute, getAllDisputes, getDisputeById, updateDispute, deleteDispute };
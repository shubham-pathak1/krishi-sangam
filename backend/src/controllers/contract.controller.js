import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Contract } from "../models/contract.models.js";  


// Create Contract
const createContract = asyncHandler(async (req, res) => {
    const { company_id, product, quantity, duration, place, price, status, payment_type } = req.body;

    if (![company_id, product, quantity, duration, place, price, status, payment_type ].every(Boolean)) {
        throw new ApiError(400, "All fields are required");
    }

    // Convert company_id and farmer_id to ObjectId
    const companyObjectId = new mongoose.Types.ObjectId(String(company_id));

    // Create Contract
    const contract = await Contract.create({
        company_id: companyObjectId,
        product,
        quantity,
        duration,
        place,
        price,
        status,
        payment_type
    });

    if (!contract) {
        throw new ApiError(500, "Failed to create contract");
    }

    res.status(201).json(
        new ApiResponse(201, { contract }, "Contract created successfully")
    );
});


// Get all Contracts
const getAllContracts = asyncHandler(async (req, res) => {
    const contracts = await Contract.find();
    res.status(200).json(new ApiResponse(200, contracts, "Contracts fetched successfully"));
});

// Get Contract by ID
const getContractById = asyncHandler(async (req, res) => {
    const contract = await Contract.findById(req.params.id);
    if (!contract) {
        throw new ApiError(404, "Contract not found");
    }
    res.status(200).json(new ApiResponse(200, contract, "Contract fetched successfully"));
});

// Update Contract
const updateContract = asyncHandler(async (req, res) => {
    const { status } = req.body;

    const contract = await Contract.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!contract) {
        throw new ApiError(404, "Contract not found");
    }

    // Update Contract Transaction Status as well
    await ContractTransaction.findOneAndUpdate(
        { contract_id: req.params.id },
        { status },
        { new: true }
    );

    res.status(200).json(new ApiResponse(200, contract, "Contract updated successfully"));
});

// Delete Contract & Associated Contract Transaction
const deleteContract = asyncHandler(async (req, res) => {
    const contract = await Contract.findByIdAndDelete(req.params.id);

    if (!contract) {
        throw new ApiError(404, "Contract not found");
    }

    // Delete Contract Transaction as well
    await ContractTransaction.deleteOne({ contract_id: req.params.id });

    res.status(200).json(new ApiResponse(200, null, "Contract and associated transaction deleted successfully"));
});

export { createContract, getAllContracts, getContractById, updateContract, deleteContract };
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ContractTransaction } from "../models/contractTransaction.models.js";

// Create Contract Transaction
const createContractTransaction = asyncHandler(async (req, res) => {
    const { contract_id, company_id, farmer_id, status, payment_type, payment_id } = req.body;

    if (![contract_id, company_id, farmer_id, status, payment_type].every(Boolean)) {
        throw new ApiError(400, "All fields are required");
    }

    const contractObjectId = new mongoose.Types.ObjectId(String(contract_id));
    const companyObjectId = new mongoose.Types.ObjectId(String(company_id));
    const farmerObjectId = new mongoose.Types.ObjectId(String(farmer_id));

    const transaction = await ContractTransaction.create({
        contract_id: contractObjectId,
        company_id: companyObjectId,
        farmer_id: farmerObjectId,
        status,
        payment_type,
        payment_id: payment_id || null
    });

    if (!transaction) {
        throw new ApiError(500, "Failed to create contract transaction");
    }

    res.status(201).json(new ApiResponse(201, { transaction }, "Contract transaction created successfully"));
});

// Get all Contract Transactions
const getContractTransactions = asyncHandler(async (req, res) => {
    const transactions = await ContractTransaction.find();
    res.status(200).json(new ApiResponse(200, transactions, "Contract transactions fetched successfully"));
});

// Get Contract Transaction by ID
const getContractTransactionById = asyncHandler(async (req, res) => {
    const transaction = await ContractTransaction.findById(req.params.id);
    if (!transaction) {
        throw new ApiError(404, "Contract transaction not found");
    }
    res.status(200).json(new ApiResponse(200, transaction, "Contract transaction fetched successfully"));
});

// Update Contract Transaction
const updateContractTransaction = asyncHandler(async (req, res) => {
    const { status, payment_id } = req.body;

    const transaction = await ContractTransaction.findByIdAndUpdate(
        req.params.id,
        { status, payment_id },
        { new: true }
    );

    if (!transaction) {
        throw new ApiError(404, "Contract transaction not found");
    }

    res.status(200).json(new ApiResponse(200, transaction, "Contract transaction updated successfully"));
});

// Delete Contract Transaction
const deleteContractTransaction = asyncHandler(async (req, res) => {
    const transaction = await ContractTransaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
        throw new ApiError(404, "Contract transaction not found");
    }
    res.status(200).json(new ApiResponse(200, null, "Contract transaction deleted successfully"));
});

export { createContractTransaction, getContractTransactions, getContractTransactionById, updateContractTransaction, deleteContractTransaction };

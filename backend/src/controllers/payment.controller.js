import { Payment } from "../models/payment.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const initiatePayment = asyncHandler(async (req, res) => {
    const { farmerId, companyId, amount } = req.body;
    if ([farmerId, companyId, amount].some(field => !field)) {
        throw new ApiError(400, "All fields are required");
    }
    const newPayment = await Payment.create({ farmerId, companyId, amount, paymentMethod, status: 'PENDING' });
    res.status(201).json(new ApiResponse(201, newPayment, "Payment initiated successfully"));
});

const verifyPayment = asyncHandler(async (req, res) => {
    const { paymentId, transactionId, status } = req.body;
    const payment = await Payment.findById(paymentId);
    if (!payment) {
        throw new ApiError(404, "Payment not found");
    }
    payment.status = status;
    payment.transactionId = transactionId;
    await payment.save();
    res.status(200).json(new ApiResponse(200, payment, "Payment updated successfully"));
});

const getPaymentById = asyncHandler(async (req, res) => {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
        throw new ApiError(404, "Payment not found");
    }
    res.status(200).json(new ApiResponse(200, dispute, "Fetched payment successfully"));
    });

const getAllPayments = asyncHandler(async (req, res) => {
    const payments = await Payment.find();
    res.status(200).json(new ApiResponse(200, payments, "Fetched all payments successfully"));
}); 
export { initiatePayment, verifyPayment, getPaymentById, getAllPayments };
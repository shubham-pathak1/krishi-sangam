import mongoose from "mongoose";

const contractTransSchema = new mongoose.Schema(
    {
        contract_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Contract",
            required: true,
        },
        company_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true,
        },
        farmer_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Farmer",
            required: true,
        },
        status: {
            type: Boolean,
            required: true,
        },
        payment_type: {
            type: String,
            required: [true, "Payment type is required"],
            enum: {
                values: ["Advance", "Installment", "Full Payment"],
                message: "Payment type must be one of: Advance, Installment, Full Payment"
            }
        },
        payment_id: {
            type: String,
            default: null
        },
    },
    { timestamps: true }
);

export const ContractTransaction = mongoose.model("ContractTransaction", contractTransSchema);
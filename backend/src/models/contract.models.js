import mongoose from "mongoose";

const contractSchema = new mongoose.Schema({
    company_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },
    product: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    place: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
}, { timestamps: true });

export const Contract = mongoose.model("Contract", contractSchema);

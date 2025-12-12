
import mongoose, {Schema} from "mongoose";

const paymentSchema = new Schema({
    farmerId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Farmer', 
        required: true 
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Company', 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    currency: { 
        type: String, 
        default: 'INR' 
    },
    status: { 
        type: String, 
        enum: ['PENDING', 'SUCCESS', 'FAILED'], 
        default: 'PENDING' 
    },
    paymentMethod: { 
        type: String, 
        enum: ['CREDIT_CARD', 'DEBIT_CARD', 'NET_BANKING', 'UPI'], 
        default: 'UPI' 
    },
},{ timestamps: true });

export const Payment = mongoose.model("Payment", paymentSchema)
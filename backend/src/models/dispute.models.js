import mongoose from "mongoose"

const disputeSchema = new mongoose.Schema({
    name: {
        type:String, 
        required:true
    },
    email: {
        type:String, 
        required:true, 
        unique:true
    },
    id: {
        type:String, 
        required:true
    },
    userCat:{
        type:String, 
        required:true
    },
    admin_id:{
        type:mongoose.Schema.Types.ObjectId, 
        required:true
    },
    phone:{
        type:Number, 
        required:true
    },
    raised_date:{
        type:Date, 
        required:true
    },
    resolution_date:{
        type:Date, 
        required:true
    },
    dispute_details:{
        type:String, 
        required:true
    },
    status:{
        type:Boolean, 
        required:true
    },
    outcome:{
        type:String, 
        required:true
    }

}, {timestamps:true})

export const Dispute = mongoose.model("Dispute", disputeSchema)
import mongoose from "mongoose"

const companySchema = new mongoose.Schema({
    company_name:{
        type:String,
        required:true
    }
    ,email:{
        type:String,
        required: true,
        unique:true
    },
    address:{
        type:String,
        required:true
    },
    phone_no:{
        type:Number,
        required:true,
        unique:true
    },
    gstin:{
        type:String,
        required:true,
        unique:true
    }
},{timestamps:true})

export const Company = mongoose.model("Company", companySchema)
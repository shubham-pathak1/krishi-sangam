import mongoose from "mongoose"

const farmerSchema = new mongoose.Schema({
    name:{
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
    land_size:{
        type:Number,
        required:true
    },
    phone_no:{
        type:Number,
        required:true,
        unique:true
    },
    id_proof:{
        type:String,
        required:true,
        unique:true
    },
    survey_no:{
        type:String,
        required:true,
        unique:true
    },
    crop_one:{
        type:String,
        required:true
    },
    crop_two:{
        type:String,
        required:true
    },
},{timestamps:true})

export const Farmer = mongoose.model("Farmer", farmerSchema)
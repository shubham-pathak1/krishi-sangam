import mongoose from "mongoose"

const adminSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    address:{type:String, required:true},
    phone:{type:Number, required:true, unique:true},
    dob:{type:Date, required:true}
}, {timestamps:true})

export const Admin = mongoose.model("Admin", adminSchema)
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js"



const AdminVerify = asyncHandler(async(req, _, next)=>{
    try {
        const category = req.cookies.category
        if (category == "Admin")
        {
            next()
        }
        else{
           throw new ApiError(401, "Unauthorized request")
        }
    } catch (error) {
        throw new ApiError(401, "Unauthorized request")
    }
})
const FarmerVerify = asyncHandler(async(req, _, next)=>{
    try {
        const category = req.cookies.category
        if (category == "Farmer" || category == "Admin")
        {
            next()
        }
        else{
            throw new ApiError(401, "Unauthorized request")
        }
    } catch (error) {
        throw new ApiError(401, "Unauthorized request")
    }
})
const CompanyVerify = asyncHandler(async(req, _, next)=>{
    try {
        const category = req.cookies.category
        if (category == "Company" || category == "Admin")
        {
            next()
        }
        else{
           throw new ApiError(401, "Unauthorized request")
        }
    } catch (error) {
        throw new ApiError(401, "Unauthorized request")
    }
})

export {AdminVerify, CompanyVerify, FarmerVerify}
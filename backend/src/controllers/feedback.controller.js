import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Feedback } from "../models/feedback.models.js";


const createFeedback = asyncHandler(async (req, res) => {
    try {
        const {name, email, phone, message} = req.body
        if (![name, email, phone, message]){
            ApiError(400, "All fields are required");
        }
        const feedback = await Feedback.create({name, email, phone, message});
        if (!feedback) {
                    throw new ApiError(500, "Failed to create feedback");
                }
            
                res.status(201).json(new ApiResponse(201, feedback, "feedback created successfully"));
    } catch (error) {
        ApiError(500, "Failed to proceed please try again later")
    }
        
})
// Get all Companies
const getAllFeedback = asyncHandler(async (req, res) => {
    try {
        const feedback = await Feedback.find();
        res.status(200).json(new ApiResponse(200, feedback, "feedback fetched successfully"));
    } catch (error) {
        ApiError(500, "Failed to proceed please try again later")
    }
});


export { createFeedback, getAllFeedback};








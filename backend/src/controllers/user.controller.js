import { asyncHandler  } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

const generateAccessAndRefreshTokens = async(userId)=>{
    try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken =  user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}

    }catch(error){
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}



const registerUser = asyncHandler(async (req, res) => {

    const { Category, Email, Phone_no, Name, password } = req.body;

    if (![Category, Name, password].every(field => field?.trim())) {
        throw new ApiError(400, "All fields are required");
    }
    if (!Email && !Phone_no){
        throw new ApiError(400, "Email id or phone number is required")
    }


    const existingUser = await User.findOne({ $or: [{ Phone_no }, { Email }] });
    if (existingUser) {
        throw new ApiError(409, "User with this phone number or email already exists");
    }

    const user = await User.create({ Category, Email, Name, Phone_no, isactive: false, password });
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    return res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"));
});



const loginUser = asyncHandler (async (req, res) => {
    const {Email,Phone_no, password} = req.body
    if(!(Phone_no||Email)){
        throw new ApiError(400, "Email or Phone_no or Password is required")
    }

    const user = await User.findOne({$or: [{Phone_no}, {Email}]})

    if (!user){
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid)
    {
        throw new ApiError(401, "Invalid user credentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)
    const loggedInUser = await User.findById(user._id).
    select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",      
        maxAge: 24 * 60 * 60 * 1000,
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .cookie("category", loggedInUser.Category, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})

const logoutUser = asyncHandler(async(req, res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: false,
        sameSite: "Lax", 
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .clearCookie("category", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async(req, res)=>{
    const incomingRefreshToken = req.cookies.
    refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401, "unauthorized request")
    }

    const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    )
    try {
        const user = await User.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError(401, "Invalid Refresh Token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh token is expired or used")
        }
    
        const options={
        httpOnly: true,
        secure: false,
        sameSite: "Lax", 
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(200,
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || 
            "Invalid refresh token"
        )
    }

})

const changeCurrentPassword = asyncHandler(async(req, res)=>{
    const {oldPassword, newPassword, confPassword} = req.body
    if(!(newPassword === confPassword)){
        throw new ApiError(400, "New password and confirm password Don't match")
    }
    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: flase})

    return res.status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const getCurrentUser = asyncHandler(async(req, res)=>{
    return res
    .status(200)
    .json(200, req.user, "Current user fetched successfully")
})

const updateAccountDetails = asyncHandler(async(req, res) => {
    const {name, Email, Phone_no} = req.body

    if(!(name || Phone_no || Email)){
        throw new ApiError(400, "All fields are not entered properly")
        //400 error
    }


    //This update route is incomplete and have to be modified according to the model
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                name,
                Phone_no, 
                Email
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200
    .json(new ApiResponse(200, user, "Account details updated successfully"))
    )
})

export { registerUser, loginUser, logoutUser, refreshAccessToken, getCurrentUser, changeCurrentPassword, updateAccountDetails}
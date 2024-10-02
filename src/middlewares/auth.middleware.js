import { ApiError } from "../utils/apiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { NewUser } from "../models/registeration.model.js";

const verifyjwt = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authoriazation")?.replace("Bearer ", "")
    
        if(!token) {
            throw new ApiError(400, "unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const existedUser = await NewUser.findById(decodedToken._id).select("-password -refreshToken")
    
        if(!existedUser) {
            throw new ApiError(400, "invalid access Token")
        }
    
        req.existedUser = existedUser;
        next()
    } catch (error) {
        throw new ApiError(400, error?.message || "invalid access token")
    }

}) 

export {verifyjwt}
import { ApiError } from "../utils/apiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { admin } from "../models/admin.model.js";
import { superFran } from "../models/superfranchisee.model.js";
import { franch } from "../models/franchisee.model.js";
// import { User } from "../models/user.model.js";

const verifyjwt = asyncHandler(async (req, res, next) => {
    try {
        const token = req.body?.cookies || req.cookies?.accessToken || req.header("Authoriazation")?.replace("Bearer ", "")
    
        if(!token) {
            throw new ApiError(400, "unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const existedUser = await admin.findById(decodedToken._id).select("-password -refreshToken")
        const existedUser2 = await superFran.findById(decodedToken._id).select("-password -refreshToken")
        const existedUser3 = await franch.findById(decodedToken._id).select("-password -refreshToken")
    
        if(!(existedUser || existedUser2 || existedUser3)) {
            throw new ApiError(400, "invalid access Token")
        }
    
        if (existedUser) {
            req.existedUser = existedUser;
        } 
        else if (existedUser2) {
            req.existedUser = existedUser2;
        }
        else if (existedUser3) {
            req.existedUser = existedUser3;
        }

        next()
    } catch (error) {
        throw new ApiError(400, error?.message || "invalid access token")
    }

}) 

export {verifyjwt}
// import { NewUser } from "../models/registeration.model";
import { ApiError } from "../utils/apiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const verifyAdmin = asyncHandler(async (req,res,next) => {
    if(!(['admin','superfranchisee','franchisee'].includes(req.existedUser.role))) {
        throw new ApiError(400, "you are not eligible for registering user")
    } 
    else if(req.existedUser.role == "admin") {
        next();
    }
    else if(req.existedUser.role == "superfranchisee") {
        next();
    }
    else if(req.existedUser.role == "franchisee") {
        next();
    }
    else{
        return res.status(400).json(
            new ApiError(400, "your request is Unauthorised")
        )
    }
})

export {verifyAdmin}
import { ApiError } from "../utils/apiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const AdminForTest = asyncHandler(async (req,res,next) => {
    
    if(!(req.existedUser.role == "admin")) return res.status(500).json(new ApiError(500,"you do not have permission"))
    
    next()
})

export {AdminForTest}
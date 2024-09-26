import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiErrors.js"
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Apiresponse } from "../utils/apiresponse.js";

const registerUser = asyncHandler(async (req,res) => {
    
    const {fullname, email, username, password} = req.body

    if(
        [fullname,email,username,password].some((field) => field.trim() == "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existeduser = await User.findOne({
        $or: [{ username },{ email }]
    })

    if(existeduser) {
        throw new ApiError(409, "user with email or username already existed")
    }
    
    const avatarLocalPath = req.files.avatar[0]?.path;
    const coverImageLocalPath = req.files.coverImage[0]?.path;
    console.log(req.files)

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "something went wrong while registering user")
    }

    return res.status(201).json(
        new Apiresponse(200, createdUser, "user registered successfully")
    )
}
)

export {registerUser} 
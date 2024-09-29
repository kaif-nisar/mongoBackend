import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiErrors.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Apiresponse } from "../utils/apiresponse.js";

// generating refresh and access token 
const genRefandAccToken = async (userId) => {
    const byIduser = await User.findById(userId)

    const accessToken = await byIduser.generateAccessToken()
    const refreshToken = await byIduser.generateRefreshToken()

    console.log("this is the accessToken: ", accessToken)
    console.log("this is the refreshToken: ", refreshToken)

    byIduser.refreshToken = refreshToken
    byIduser.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }
}

// registering user into database

const registerUser = asyncHandler(async (req, res) => {

    const { fullname, email, username, password } = req.body

    if (
        [fullname, email, username, password].some((field) => field.trim() == "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existeduser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existeduser) {
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

const loginUser = asyncHandler(async (req, res) => {
    //req.body se data fetch karo
    //validate data
    //find user in database by username and password
    //match the given data to database
    //match password with the given password
    //generate refresh and access token after match data 
    //send refresh and access token by cookie
    const { email, username, password } = req.body
    console.log(req.body);

    if (!(email || username)) {
        throw new ApiError(400, "username or email is required ui")
    }

    const regUser = await User.findOne({
        $or: [
            { username: username },
            { email: email }
        ]
    })

    if (!regUser) {
        throw new ApiError(400, `user with email or username not registered`)
    }

    const truePass = regUser.isPasswordCorrect(password)

    if (!truePass) {
        throw new ApiError(400, "your password is incorrect")
    }

    const { accessToken, refreshToken } = await genRefandAccToken(regUser._id)

    const regUser1 = await User.findOne(regUser._id).select(
        "-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new Apiresponse(
                200,
                {
                    user: regUser1, accessToken, refreshTokengen
                },
                "user login successfully"
            )
        )

})

//for new access token generation
const genAccessTokenbyRefresh = asyncHandler( async (req,res) => {
    const userRefreshToken = req.cookies?.refreshToken || req.body.refreshToken

    if (!userRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedrefreshToken = jwt.verify(userRefreshToken, process.env.REFRESH_TOKEN_SECRET) 
    
        const refreshTokenUser = await User.findById(decodedrefreshToken._id)
    
        if(refreshTokenUser.refreshToken != userRefreshToken) {
            throw new ApiError(400, "invalid or expired refreshToken")
        }
    
        const { accessToken, refreshToken } = await genRefandAccToken(refreshTokenUser._id)
    
        res.status(200)
        .cookie("accessToken", accessToken, {httpOnly: true, secure: true})
        .cookie("refreshToken", refreshToken, {httpOnly: true, secure: true})
        .json(
            new Apiresponse(
                200,
                {accessToken, refreshToken},
                "new accessToken generated"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "invalid refreshToken")
    }

})

// for user logout
const logoutUser = asyncHandler(async (req, res) => {
    User.findByIdAndUpdate(
        req.existedUser._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new Apiresponse(200, {}, "user logout successfully"))

})

export { registerUser, loginUser, logoutUser, genAccessTokenbyRefresh } 
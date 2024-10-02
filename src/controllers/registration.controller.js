import {asyncHandler} from "../utils/asyncHandler.js"
import {NewUser} from "../models/registeration.model.js"
import { ApiError } from "../utils/apiErrors.js"
import { Apiresponse } from "../utils/apiresponse.js"
import { creatingAccount } from "../utils/creating.users.js"

//generating refresh and accessToken
const generatingrefreshandaccessToken = async function (userId) {
    const Auser = await NewUser.findById(userId)

    const accessToken = await Auser.generateAccessToken()
    const refreshToken = await Auser.generateRefreshToken()

    Auser.refreshToken = refreshToken
    await Auser.save({validateBeforeSave: false})

    return {accessToken, refreshToken}
}

// superFranchiseeRegistration a user or admin
const superFranchiseeRegistration = asyncHandler(async (req, res) => {

    let { fullname, email, username, password, state, city, franchisee_name, role } = req.body

    if (role !== "superfranchisee") {
        role = "superfranchisee"
    }

    const createdUserObject = await creatingAccount(fullname, email, username, password, state, city, franchisee_name, role)

    return res.status(200)
    .json(
        new Apiresponse(200, {user: createdUserObject}, "user created successfully")
    )

})

// subfranchisee registeration 
const subFranchiseeRegistration = asyncHandler(async (req, res) => {

    let { fullname, email, username, password, state, city, francisee_name, role } = req.body

    if (role !== "subfranchisee") {
        role = "subfranchisee"
    }

    const createdUserObject = await creatingAccount(fullname, email, username, password, state, city, franchisee_name, role)

    return res.status(200)
    .json(
        new Apiresponse(200, {user: createdUserObject}, "user created successfully")
    )

})

//franchisee registeration
const FranchiseeRegistration = asyncHandler(async (req, res) => {

    let { fullname, email, username, password, state, city, franchisee_name, role } = req.body

    if (role !== "franchisee") {
        role = "franchisee"
    }

    const createdUserObject = await creatingAccount(fullname, email, username, password, state, city, franchisee_name, role)
    return res.status(200)
    .json(
        new Apiresponse(200, {user: createdUserObject}, "user created successfully")
    )
})

// for user login 
const isUserlogin = asyncHandler(async (req, res) => {

    const { email, username, password } = req.body

    if (!(email || username)) {
        throw new ApiError(400, "username or email is required")
    }

    const regUser = await NewUser.findOne({
        $or: [
            { username: username },
            { email: email }
        ]
    })

    if (!regUser) {
        throw new ApiError(400, `user with email or username not registered`)
    }

    let truePass = await regUser.isPasswordCorrect(password)

    if (!truePass) {
        throw new ApiError(400, "your password is incorrect")
    }

    const { accessToken, refreshToken } = await generatingrefreshandaccessToken(regUser._id)

    const regUser1 = await NewUser.findOne(regUser._id).select(
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
                    user: regUser1, accessToken, refreshToken
                },
                "user login successfully"
            )
        )

})

export {superFranchiseeRegistration, subFranchiseeRegistration, FranchiseeRegistration, isUserlogin}
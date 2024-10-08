import { asyncHandler } from "../utils/asyncHandler.js"
import { admin } from "../models/admin.model.js"
import { ApiError } from "../utils/apiErrors.js"
import { Apiresponse } from "../utils/apiresponse.js"
import { superFran } from "../models/superfranchisee.model.js"
import { franch } from "../models/franchisee.model.js"
import { subfranch } from "../models/subfranchisee.model.js"

//generating refresh and accessToken
const generatingrefreshandaccessToken = async function (user) {

    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }
}

// admin registeration
const adminregisteration = asyncHandler(async (req, res) => {

    let { fullname, email, username, password, state, city, role } = req.body

    if (role !== "admin") {
        role = "admin"
    }

    if (!(fullname || email || username || password)) {
        throw new ApiError(400, "All fields are required")
    }

    // checking if user already existed
    const alreadyExistedUser = await admin.findOne({
        $or: [
            { email },
            { username }
        ]
    })

    if (alreadyExistedUser) {
        throw new ApiError(400, "user allready exists")
    }

    const createdUser = await admin.create({
        fullname,
        username,
        email,
        password,
        role,
        state,
        city
    })

    const createdUserObject = await admin.findById(createdUser._id).select("-password -refreshToken")

    return res.status(200)
        .json(
            new Apiresponse(200, { user: createdUserObject }, "user created successfully")
        )

})

// superFranchiseeRegistration a user or admin
const superFranchiseeRegistration = asyncHandler(async (req, res) => {

    let { fullname, email, username, password, state, city, franchisee_name, role } = req.body

    if (role !== "superfranchisee") {
        role = "superfranchisee"
    }

    if (!(fullname || email || username || password)) {
        throw new ApiError(400, "All fields are required")
    }

    // checking if user already existed
    const alreadyExistedUser = await superFran.findOne({
        $or: [
            { email },
            { username }
        ]
    })

    if (alreadyExistedUser) {
        throw new ApiError(400, "user allready exists")
    }

    const createdUser = await superFran.create({
        fullname,
        username,
        email,
        password,
        role,
        state,
        city,
        franchisee_name
    })

    const createdUserObject = await superFran.findById(createdUser._id).select("-password -refreshToken")

    return res.status(200)
        .json(
            new Apiresponse(200, { user: createdUserObject }, "user created successfully")
        )

})

// subfranchisee registeration 
const subFranchiseeRegistration = asyncHandler(async (req, res) => {

    let { fullname, email, username, password, state, city, franchisee_name, role } = req.body

    if (role !== "subfranchisee") {
        role = "subfranchisee"
    }

    if (!(fullname || email || username || password)) {
        throw new ApiError(400, "All fields are required")
    }

    // checking if user already existed
    const alreadyExistedUser = await subfranch.findOne({
        $or: [
            { email },
            { username }
        ]
    })

    if (alreadyExistedUser) {
        throw new ApiError(400, "user allready exists")
    }

    const createdUser = await subfranch.create({
        fullname,
        username,
        email,
        password,
        role,
        state,
        city,
        franchisee_name
    })

    const createdUserObject = await subfranch.findById(createdUser._id).select("-password -refreshToken")

    return res.status(200)
        .json(
            new Apiresponse(200, { user: createdUserObject }, "user created successfully")
        )

})

//franchisee registeration
const FranchiseeRegistration = asyncHandler(async (err, req, res) => {

    let { fullname, email, username, password, state, city, franchisee_name, role } = req.body

    if (role !== "franchisee") {
        role = "franchisee"
    }

    if (!(fullname || email || username || password)) {
        throw new ApiError(400, "All fields are required")
    }

    // checking if user already existed
    const alreadyExistedUser = await franch.findOne({
        $or: [
            { email },
            { username }
        ]
    })

    if (alreadyExistedUser) {
        throw new ApiError(400, "user allready exists")
    }

    const createdUser = await franch.create({
        fullname,
        username,
        email,
        password,
        role,
        state,
        city,
        franchisee_name
    })

    const createdUserObject = await franch.findById(createdUser._id).select("-password -refreshToken")

    return res.status(200)
        .json(
            new Apiresponse(200, { user: createdUserObject }, "user created successfully")
        )
})

// for user login 
const isUserlogin = asyncHandler(async (req, res) => {

    const { email, username, password } = req.body

    if (!(email || username)) {
        throw new ApiError(400, "username or email is required")
    }

    // finding in admin collection
    const regUser = await admin.findOne({
        $or: [
            { username: username },
            { email: email }
        ]
    })

    // finding in superfranchisee collection
    const supRegUser = await superFran.findOne({
        $or: [
            { username: username },
            { email: email }
        ]
    })

    // finding in franchisee collection
    const franchRegUser = await franch.findOne({
        $or: [
            { username: username },
            { email: email }
        ]
    })

    // finding in subfranchisee collection
    const subfranchRegUser = await subfranch.findOne({
        $or: [
            { username: username },
            { email: email }
        ]
    })

    if (!(regUser || supRegUser || franchRegUser || subfranchRegUser)) {
        throw new ApiError(400, "user not found")
    }

    let regUser1;
    let accessToken, refreshToken;

    // processing when user is admin
    if (regUser) {
        let truePass = await regUser.isPasswordCorrect(password)

        if (!truePass) {
            throw new ApiError(400, "your password is incorrect")
        }

        let tokens = await generatingrefreshandaccessToken(regUser)

        accessToken = tokens.accessToken;
        refreshToken = tokens.refreshToken;

        regUser1 = await admin.findOne(regUser._id).select(
            "-password -refreshToken")
    }

    // processing when user is superFranchisee
    if (supRegUser) {
        let truePass = await supRegUser.isPasswordCorrect(password)

        if (!truePass) {
            throw new ApiError(400, "your password is incorrect")
        }

        let tokens = await generatingrefreshandaccessToken(supRegUser)

        accessToken = tokens.accessToken;
        refreshToken = tokens.refreshToken;

        regUser1 = await superFran.findOne(supRegUser._id).select(
            "-password -refreshToken")
    }

    // processing when user is Franchisee
    if (franchRegUser) {
        let truePass = await franchRegUser.isPasswordCorrect(password)

        if (!truePass) {
            throw new ApiError(400, "your password is incorrect")
        }

        let tokens = await generatingrefreshandaccessToken(franchRegUser)

        accessToken = tokens.accessToken;
        refreshToken = tokens.refreshToken;

        regUser1 = await franch.findOne(franchRegUser._id).select(
            "-password -refreshToken")
    }

    // processing when user is subFranchisee
    if (subfranchRegUser) {
        let truePass = await subfranch.isPasswordCorrect(password)

        if (!truePass) {
            throw new ApiError(400, "your password is incorrect")
        }

        let tokens = await generatingrefreshandaccessToken(subfranchRegUser)

        accessToken = tokens.accessToken;
        refreshToken = tokens.refreshToken;

        regUser1 = await subfranch.findOne(subfranchRegUser._id).select(
            "-password -refreshToken")
    }

    const options = {
        httpOnly: true,
       secure: true,
        // sameSite: 'Lax',  // Use 'None' for cross-site requests, and ensure secure is true
        // maxAge: 60 * 60 * 1000,
    }

    // req.cookies = {accessToken, refreshToken}

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new Apiresponse(
                200,
                {
                    accessToken: accessToken,
                    refreshToken: refreshToken
                },
                "user login successfully"
                // err.message
            )
        )

})

//export { adminregisteration, superFranchiseeRegistration, subFranchiseeRegistration, FranchiseeRegistration, isUserlogin }

export {
    adminregisteration,
    isUserlogin,
    superFranchiseeRegistration,
    FranchiseeRegistration,
    subFranchiseeRegistration
}
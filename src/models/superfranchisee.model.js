import mongoose, { Schema } from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { admin } from "./admin.model.js"


const superFranSchema = new Schema({
    
        fullname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true
        },
        password: {
            type: String,
            required: [true, "password is required"]
        },
        state: {
            type: String,
        },
        city: {
            type: String
        },
        role: {
            type: String,
        },
        franchisee_name: {
            type: String,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'admin', // Reference to the admin who created this user
        },
        refreshToken: {
            type: String,
        }
},
    {
        timestamps: true
    }
)

superFranSchema.pre("save", async function (next) {

    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

superFranSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

superFranSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

superFranSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET
        , {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const superFran = mongoose.model("superFranSchema", superFranSchema)
import mongoose, { Schema } from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const adminSchema = new Schema({
    
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
        // createdBy: {
        //     type: Schema.Types.ObjectId,
        //     ref: 'NewUser',  // Reference to the user who created this user
        // },
        refreshToken: {
            type: String,
        }
},
    {
        timestamps: true
    }
)

adminSchema.pre("save", async function (next) {

    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

adminSchema.methods.generateAccessToken = async function () {
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

adminSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

adminSchema.methods.generateRefreshToken = async function () {
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

export const admin = mongoose.model("admin", adminSchema)
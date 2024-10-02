import {NewUser} from "../models/registeration.model.js"
import { ApiError } from "../utils/apiErrors.js"

const creatingAccount = async function(fullname, email, username, password, state, city, franchisee_name, role) {

try {
    if(!(fullname || email || username || password)) {
        throw new ApiError(400, "All fields are required")
    }
    
    // checking if user already existed
    const alreadyExistedUser = await NewUser.findOne({
        $or: [
            {email},
            {username}
        ]
    })
    
    if(alreadyExistedUser) {
        throw new ApiError(400, "user allready exists")
    }
    
    // creating user and save it to database
    const createdUser = await NewUser.create({
        fullname,
        username,
        email,
        password,
        role, 
        state, 
        city, 
        franchisee_name
    })

    const createdUserObject = await NewUser.findById(createdUser._id).select("-password -refreshToken")

    return createdUserObject

} catch (error) {
    throw new ApiError(400, "Error: while creating user")
}

}

export {creatingAccount}
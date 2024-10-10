import { testSchema } from "../models/newTest.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Apiresponse } from "../utils/apiresponse.js"
import {categorySchema, Counter} from "../models/category.model.js"
import dbconnect from "../db/dbconnection.js"
import { ApiError } from "../utils/apiErrors.js"


const addingTest = asyncHandler(async (req, res) => {

    // trim all values in req.body
    Object.entries(req.body).forEach(([key, value]) => {
        if (typeof value === "string") {
            req.body[key] = value.trim()
        }
    })

    const { Name, Short_name, category, Price, parameters } = req.body

    // if (!(req.existedUser.role == "admin")) {
    //     throw new ApiError(400, "you are not the admin")
    // }

    if (!(Array.isArray(parameters))) {
        throw new ApiError(400, "atleast one parameter is required")
    }

    // checking if test is allready in database
    const allreadyExistedTest = await testSchema.findOne({
        $or: [
            { Name: Name },
            { Short_name: Short_name },
        ]
    })

    if (allreadyExistedTest) {
        throw new ApiError(400, "Test was already present in database")
    }

    const testCreated = await testSchema.create({
        Name,
        Short_name,
        category: category || "",
        Price,
        parameters: parameters || ""
    })

    return res.json({
        status: 200,
        test: testCreated,
        message: "test is created sucessfully"
    })

})

const editTest = asyncHandler(async (req, res) => {

    const { testName, ShortName } = req.params

    Object.entries(req.body).forEach(([key, value]) => {
        if(typeof value === "string") {
            req.body[key] = value.trim()
        }
    })

    const { Name, Short_name, category, Price, parameters } = req.body

    const editedTest = await testSchema.findOneAndUpdate(
        {
            $and: [
                { Name: testName },
                { Short_name: ShortName }
            ]
        },
        {
            $set: {
                Name: Name,
                Short_name: Short_name,
                category,
                Price,
                parameters
            }
        },
        { new: true }
    )

    if (!editedTest) {
        throw new ApiError(400, "unwanted error when updating test")
    }

    return res.json( new Apiresponse(200, {edited: editedTest}, "test edited successfully"))
})

const allTest = asyncHandler(async (req, res) => {

    const allrecievedTest = await testSchema.find()

    if(!allrecievedTest) {
        throw new ApiError(400, "Something went wrong while fetching details")
    }

    return res.json(allrecievedTest)

})

// for test category creation
const testCate = asyncHandler(async (req, res) => {
    
    const {catName} = req.body

    if(!catName && typeof catName !== "string") {
        throw new ApiError(500, "please enter category Name")
    }

    const incremented = await Counter.findOneAndUpdate(
        {_id:"orderId"},
        {$inc: {sequence_value: 1}},
        {new: true, upsert: true}
    )

    console.log(incremented)

    if(!incremented) {
        throw new ApiError(400, "please give the valid order_id")
    }

    const newCategory = await categorySchema.create({
        orderId: incremented.sequence_value,
        category : catName
    })

    if(!newCategory) {
        throw new ApiError(400, "something went wrong")
    }

    return res.json(new Apiresponse(200, {newCategory}, "category added successfull"))

})

//for test category edit
const editTestCate = asyncHandler(async (req, res) => {

    const {category} = req.params

    if(!category) {
        throw new ApiError(400, "an error occured when sending variables through url")
    }

    const {catName} = req.body

    if(!catName) {
        throw new ApiError(400, "please enter Name")
    }

    const editedCategory = await categorySchema.findOneAndUpdate(
        {category :category},
        { $set: 
            {category: catName}
        },
        {new: true}
    )

    if(!editedCategory) {
        throw new ApiError(400, "something went wrong")
    }

    return res.json(new Apiresponse(200, {editedCategory}, "category edited successfully"))

})

export { addingTest,
         editTest,
         allTest,
         testCate,
         editTestCate
}
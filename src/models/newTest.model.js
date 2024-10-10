import mongoose, { Schema } from "mongoose"

const parameterSchema = new Schema({
    order: Number,
    Para_name: String,
    unit: Number,
    groupby: String,
    defaultresult: String
})

const TestSchema = new Schema({
    Name: {
        type: String,
        required: true
    },
    Short_name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        // required: true
    },
    Price: {
        type: Number,
        required: true
    },
    parameters: [parameterSchema]
})

export const testSchema = mongoose.model("test", TestSchema)
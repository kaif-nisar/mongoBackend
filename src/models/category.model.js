import mongoose, {Schema} from "mongoose"

const counterSchema = new Schema({
    _id: {
        type: String,
    },
    sequence_value : {
        type: Number,
        unique: true
    }
})

const cateSchema = new Schema({
    orderId: {
        type: Number,
        unique: true
    },
    category: {
        type: String,
        required: true
    }
})

const categorySchema = mongoose.model("test-category", cateSchema) 
const Counter = mongoose.model("counter", counterSchema)

export {Counter, categorySchema}
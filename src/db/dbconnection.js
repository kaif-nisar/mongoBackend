import mongoose from "mongoose"
import express from "express"
import { DB_NAME } from "../constants.js"


const app = express()

let dbconnect = async () => {
    try {
        const connectioninstance = await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`)
        console.log(`database connection successfull at port ${connectioninstance.connection.host}`);
    }
    catch(error) {
        console.log(error)
        process.exit(1);
    }
}

export default dbconnect
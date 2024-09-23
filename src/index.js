import dotenv from "dotenv"
import dbconnect from "./db/dbconnection.js"

dotenv.config({
    path:'./env'
})

dbconnect()



// const app = express()

// ( async () => {
//     try {
//         await mongoose.connect(`${MONGO_URL}/${DB_NAME}`)
//         app.on("apperror", () => {
//             console.log("this is a app errr", apperror)
//             throw error
//         })

//         app.listen(process.env.PORT, () => {
//             console.log(`app listening on port ${process.env.PORT}`);
//         })
//     }
//     catch(error) {
//         console.log("error", error)
//         throw err
//     }
// })()
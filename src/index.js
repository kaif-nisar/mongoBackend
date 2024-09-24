import dotenv from "dotenv"
import dbconnect from "./db/dbconnection.js"

dotenv.config({
    path:'./env'
})

dbconnect()
.then(() => {
     app.listen(process.env.PORT || 8000, () => {
        console.log(`server is running at port ${process.env.PORT}`)
     })
})
.catch((error) => {
    console.log(`error while cooncting to the server`, error)
})



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
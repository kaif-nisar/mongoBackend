import dotenv from "dotenv"
import dbconnect from "./db/dbconnection.js"
import {app} from "./app.js"

dotenv.config({
    path:'./.env'
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
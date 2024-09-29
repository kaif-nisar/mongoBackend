import {Router} from "express"
import { registerUser, loginUser, logoutUser, genAccessTokenbyRefresh } from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyjwt } from "../middlewares/auth.middleware.js"

const router = Router()

// user registeration
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ])
    ,registerUser)

//for user login
router.route("/loginuser").post(loginUser)

//for user logout
router.route("/logout").post(verifyjwt, logoutUser)

//for access token regeneration
router.route("/access-route").post(genAccessTokenbyRefresh)

export default router
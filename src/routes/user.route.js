import {Router} from "express"
import { registerUser, loginUser, logoutUser, genAccessTokenbyRefresh} from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyjwt } from "../middlewares/auth.middleware.js"
import { isUserlogin, superFranchiseeRegistration, subFranchiseeRegistration, FranchiseeRegistration } from "../controllers/registration.controller.js"
import { verifyAdmin } from "../middlewares/verifyadmin.js"

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



// for user or admin login
router.route("/login").post(isUserlogin)

// for user superFranchiseeregistration
router.route("/super-franchisee-registeration").post(verifyjwt, verifyAdmin, superFranchiseeRegistration)

// for user subFranchiseeregisteration
router.route("/sub-franchisee-registration").post(verifyjwt, verifyAdmin, subFranchiseeRegistration)

// for user franchiseeregisteration
router.route("/franchisee-registration").post(verifyjwt, verifyAdmin, FranchiseeRegistration)

// _____________________________________________________________

/*
//for user login
router.route("/loginuser").post(loginUser)

//for user logout
router.route("/logout").post(verifyjwt, logoutUser)

//for access token regeneration
router.route("/access-route").post(genAccessTokenbyRefresh)
*/

export default router
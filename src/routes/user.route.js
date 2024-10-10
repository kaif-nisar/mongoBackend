import {Router} from "express"
import { registerUser, loginUser, logoutUser, genAccessTokenbyRefresh} from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyjwt } from "../middlewares/auth.middleware.js"
import { adminregisteration, isUserlogin, superFranchiseeRegistration, FranchiseeRegistration, subFranchiseeRegistration } from "../controllers/registration.controller.js"
import { verifyAdmin } from "../middlewares/verifyadmin.js"
import { AdminForTest } from "../middlewares/addtest.middleware.js"
import { addingTest, editTest, allTest, testCate, editTestCate } from "../controllers/addtest.controller.js"

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

//admin registeration
router.route("/admin-reg").post(adminregisteration)

// for user or admin login
router.route("/login").post(isUserlogin)

//for user superFranchiseeregistration
router.route("/super-franchisee-registeration").post(verifyjwt, verifyAdmin, superFranchiseeRegistration)

// for user Franchiseeregisteration
router.route("/franchisee-registration").post(verifyjwt, verifyAdmin, FranchiseeRegistration)

// for user subFranchiseeregisteration
router.route("/sub-franchisee-registration").post(verifyjwt, verifyAdmin, subFranchiseeRegistration)

// for adding new test
router.route("/adding-test").post(verifyjwt, AdminForTest, addingTest)
// router.route("/adding-test").post(addingTest)

// for editing test details
router.route("/edit-test/:testName/:ShortName").post(verifyjwt, AdminForTest, editTest)

// for fetching all test data
//router.route("/test-database").post(verifyjwt, AdminForTest, allTest)
 router.route("/test-database").post(allTest)

// for creating test categories
router.route("/test-categories").post(verifyjwt, AdminForTest, testCate)

// for editing test-category
router.route("/test-edit-category/:category").post(verifyjwt, AdminForTest, editTestCate)
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
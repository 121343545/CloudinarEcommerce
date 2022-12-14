const express=require('express');
const { getProductReviews, deleteProductReviews } = require('../controllers/productController');
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUser, getSingleUser, updateUserRole, deleteProfile } = require('../controllers/userController');
const {isAuthenticateduser}=require('../middleware/auth')
const {authorizedrole}=require('../middleware/auth')
const router=express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser)
router.route('/logout').get(logout)
router.route("/password/forget").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)
router.route("/me").get(isAuthenticateduser,getUserDetails)
router.route("/password/update").put(isAuthenticateduser,updatePassword)
router.route("/me/update").put(isAuthenticateduser,updateProfile)
router.route("/admin/users").get(isAuthenticateduser,authorizedrole('admin'),getAllUser)
router.route("/admin/user/:id").get(isAuthenticateduser,authorizedrole('admin'),getSingleUser)
router.route("/admin/userrole/:id").put(isAuthenticateduser,authorizedrole('admin'),updateUserRole)
router.route("/admin/userdelete/:id").delete(isAuthenticateduser,authorizedrole('admin'),deleteProfile)
router.route("/reviews").get(getProductReviews).delete(isAuthenticateduser,deleteProductReviews)
module.exports=router;
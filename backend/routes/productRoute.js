const express=require('express')
const { getAllProduct,createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview } = require("../controllers/productController")
const { create } = require('../models/productModel')
const {isAuthenticateduser}=require('../middleware/auth')
const {authorizedrole}=require('../middleware/auth')


const router=express.Router()

router.route("/products").get(getAllProduct)

router.route("/admin/products/new").post(isAuthenticateduser,authorizedrole("admin"),createProduct)

router.route("/admin/products/:id").put(isAuthenticateduser,authorizedrole("admin"),updateProduct)

router.route("/admin/products/:id").delete(isAuthenticateduser,deleteProduct)

router.route("/product/:id").get(getProductDetails)
router.route("/review").put(isAuthenticateduser,createProductReview)

module.exports=router
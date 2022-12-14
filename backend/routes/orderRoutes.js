const express=require("express")
const { createOrder, getSingleOrder, myOrder, getAllOrder, updateOrder, deleteOrder } = require("../controllers/orderController")
const router=express.Router()

const {isAuthenticateduser}=require('../middleware/auth')
const {authorizedrole}=require('../middleware/auth')


router.route('/order/new').post(isAuthenticateduser,createOrder)
router.route('/order/:id').get(isAuthenticateduser,getSingleOrder)
router.route('/orders/me').get(isAuthenticateduser,myOrder)
router.route('/admin/orders').get(isAuthenticateduser,authorizedrole("admin"),getAllOrder)
router.route('/admin/order/:id').put(isAuthenticateduser,authorizedrole("admin"),updateOrder)
router.route('/admin/orders/:id').delete(isAuthenticateduser,authorizedrole("admin",deleteOrder))
module.exports=router
const Order=require('../models/orderModel')
const Product=require("../models/productModel");
const Apifeatures = require("../utils/apifeatures");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");


//create new order
exports.createOrder=catchAsyncError(async(req,res,next)=>{
    const{
     shippingInfo,
     orderItems,
     paymentInfo,
     itemsPrice,
     taxPrice,
     shippingPrice,
     totalPrice

    }=req.body;
    
    const order=await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id
    })
    
    console.log("error1")
    res.status(201).json({
       success:true,
       order
    })
    
})
// get single order by admin
exports.getSingleOrder=catchAsyncError(async(req,res,next)=>{
    const order=await Order.findById(req.params.id).populate(
        "user",
        "name email"
    )
    if(!order){
        res.status(404).json({
            message:"order not found with this id"
        })
    }
    res.status(200).json({
        success:true,
        order
    })
})

// get loged in single user all order

exports.myOrder=catchAsyncError(async(req,res,next)=>{
    const order=await Order.find({user:req.user._id})
    
    res.status(200).json({
        success:true,
        order
    })
})

// get all orders for admin
exports.getAllOrder=catchAsyncError(async(req,res,next)=>{
    const orders=await Order.find()
    
    let totalAmount=0;
    
    orders.forEach((order)=>{
        totalAmount+=order.totalPrice;
    })
    
    
    res.status(200).json({
        success:true,
        totalAmount,
        orders
    })
})

// update order status for admin
exports.updateOrder=catchAsyncError(async(req,res,next)=>{
    const order=await Order.findById(req.params.id)
     console.log(order)
    if(order.orderStatus==="delivered"){
        //return next(new ErrorHandler("you have already delivered this order",400))
        res.status(400).json({
            message:"You have already delivered this order"
        })
    }

    order.orderItems.forEach(async(order)=>{
        await updateStock(order.product,order.quantity);
    });
    console.log("error")
    order.orderStatus=req.body.status;
    console.log("error1")
    if(req.body.status==="delivered"){
        order.deliverAt=Date.now()
    }
    console.log("error2")
    await order.save({validateBeforeSave:false});
    console.log("error3")
    res.status(200).json({
        success:true,
        totalAmount,
        order
    })
})

async function updateStock(id,quantity){
   const product=await Product.findById(id);
   console.log("inner1")
   product.stock=product.stock- quantity;
   console.log("inner2")
   await product.save({validateBeforeSave:false})
}

//delete order --Admin
exports.deleteOrder=catchAsyncError(async(req,res,next)=>{
    console.log("error")
    const order=await Order.findById(req.params.id)
    console.log(order)
    if(!order){
        res.status(404).json({
            message:"order not found with this id"
        })
    }
    await order.remove();
        
    res.status(200).json({
        success:true,
    
    })
})

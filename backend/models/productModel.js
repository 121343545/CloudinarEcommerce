const mongoose=require("mongoose");
const { stringify } = require("querystring");

const productSchema= new mongoose.Schema({
 
    name:{
        type:String,
        requires:[true,"Please enter Product name"],
        trim:true
    },
    description:{
        type:String,
        requires:[true,"Please enter Product description"],

    },
    price:{
        type:Number,
        requires:[true,"Please enter Product price"],
        maxLength:[8,"Price cannot exeed 8 digit figure"]
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }

        }
    ],
    category:{
        type:String,
        required:[true,"Please enter product category"]
    },
    stock:{
        type:Number,
        required:[true,"Please enter product stock"],
        maxLength:[4,"stock cannot exeed four figures"],
        default:1
    },
    numOfReviews:{
       type:Number,
       default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"User",
                required:true
            },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:String,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    createAt:{
        type:Date,
        default:Date.now


    }

 


})

module.exports=mongoose.model("Product",productSchema)

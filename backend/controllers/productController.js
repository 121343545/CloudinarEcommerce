const catchAsyncError = require("../middleware/catchAsyncError");
const Product=require("../models/productModel");
const Apifeatures = require("../utils/apifeatures");
const ErrorHandler = require("../utils/errorhandler");


//create Product --admin route
exports.createProduct=catchAsyncError(async(req,res,next)=>{
    
    req.body.user=req.user.id;
    const product=await Product.create(req.body);

    res.status(201).json({
        success:true,
        product
    });
});



//get product

exports.getAllProduct=catchAsyncError(async (req,res,next)=>{
  
     resultPerPage=8;
     const productCount= await Product.countDocuments();
    const apiFeatures=new Apifeatures(Product.find(),req.query).search().filter()

   // const products=await apiFeatures.query;

    //let filteredProductsCount=products.length;

     apiFeatures.pagination(resultPerPage)
    

   const product=await apiFeatures.query;
   
   //console.log(filteredProductsCount)
    res.status(200).json({
    
        success:true,
        product,
        productCount,
        resultPerPage,
     
    })

});

// get single product details

exports.getProductDetails=catchAsyncError( async(req,res,next)=>{
    let product=await Product.findById(req.params.id);
    if(!product){
      return next(new ErrorHandler("product not found",404))
     /*return res.status(404).json({
        success:false,
        message:"not found"
     })*/    
    }
    res.status(200).json({
        success:true,
        product
        })

})

// update product

exports.updateProduct=catchAsyncError( async(req,res,next)=>{

    let product=await Product.findById(req.params.id);
    if(!product){
        return  next(new ErrorHandler("product not found",404)) 
    }


product=await Product.findByIdAndUpdate(req.params.id,req.body,{
    new:true,
    runValidators:true,
    useFindAndModify:false
})
res.status(200).json({
success:true,
product
})
})

//deleteproduct

exports.deleteProduct= catchAsyncError(  async(req,res,next)=>{
    let product=await Product.findById(req.params.id);

    if(!product){
        return  next(new ErrorHandler("product not found",404)) 
    }
    await product.remove();
    res.status(200).json({
        success:true,
        message:"product delete"
        })   
})

//create new review or update the review
exports.createProductReview=catchAsyncError(async(req,res,next)=>{
    const {rating,comment,productId}=req.body;
    const review={
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment,
    }
    console.log("error1")
    const product=await Product.findById(productId);
    const IsReviewd=product.reviews.find((rev)=>rev.user.toString()===req.user._id.toString())
    console.log(product)
    if(IsReviewd){
        console.log("Inner reviewd");
       product.reviews.forEach((rev) => {
        if(rev.user.toString()===req.user._id.toString())
           (rev.rating=rating),(rev.comment=comment);
       });
    }else{
        console.log("error3");
        product.reviews.push(review)
        console.log("error4")
        product.numofReviews=product.reviews.length;
    }
    console.log("error5");
    let avg=0;
    product.reviews.forEach((rev)=>{
        avg+=rev.rating;
        console.log(rev.rating)
    })/product.reviews.length
    product.ratings=avg;
    await product.save({validateBeforeSave:false})
    res.status(200).json({
        success:true
    })
})

//to see the all reviews of single product
exports.getProductReviews=catchAsyncError(async(req,res,next)=>{
    const product=await Product.findById(req.query.id);

    if(!product){
        res.status(404).json({
            message:"Product not found"
        })
    }
    res.status(200).json({
        success:true,
        reviews:product.reviews
    })
})


//to delete the review
exports.deleteProductReviews=catchAsyncError(async(req,res,next)=>{
    const product=await Product.findById(req.query.productId);
    console.log(product)
    if(!product){
        res.status(404).json({
            message:"Product not found"
        })
    }

    const reviews=product.reviews.filter(
        (rev)=>rev._id.toString() !== req.query.id.toString(),
        console.log("p")
    )
    console.log("p1")
    let avg=0;
    reviews.forEach((rev)=>{
        avg+=rev.ratings;
    });
    console.log(
        "P2"
    )

    const ratings=avg/reviews.length;
    console.log("p3")
    const numOfReviews=reviews.length;
    console.log(numOfReviews);
    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        ratings,
        numofReviews,
        
    },{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

   console.log("error5")
    res.status(200).json({
        success:true,
        
    })
})
// Delete Review
/*exports.deleteReview = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
  
    if (!product) {
     // return next(new ErrorHander("Product not found", 404));
     res.status(404).json({
        message:"Product not found"
    })
    }
  
    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );
  
    let avg = 0;
  
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    let ratings = 0;
  
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
  
    const numOfReviews = reviews.length;
  
    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  
    res.status(200).json({
      success: true,
    });
  });
  */
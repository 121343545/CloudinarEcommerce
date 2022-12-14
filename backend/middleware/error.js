const ErrorHandler=require('../utils/errorhandler');

module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode || 500;
    err.message=err.message || "Internal server error";


    //wrong mongodb Id error

    if(err.name === "CastError"){
        const message=`Resources not found .Invalid ${err.path}`;
        err=new ErrorHandler(message,400);
    }

  //moongose duplicate key error
  if(err.code=11000){
    const message=`Duplicate ${Object.keys(err.keyValue)} Entered`;
    err=new ErrorHandler(message,400);
  }
  if(err.name === "jsonWenTokenError"){
    const message=`json web token is invalid try again`;
    err=new ErrorHandler(message,400);
  }

  //wrong jwt error
  if(err.name === "jsonWenTokenError"){
    const message=`json web token is invalid try again`;
    err=new ErrorHandler(message,400);
  }

  //wrong jwt expire error
  if(err.name === "jsonWenTokenError"){
    const message=`json web token is expire try again`;
    err=new ErrorHandler(message,400);
  }

    res.status(err.statusCode).json({
        success:false,
      //  message:err.message
          message:err.message
    })

}


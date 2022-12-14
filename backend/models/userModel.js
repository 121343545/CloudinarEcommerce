const mongoose=require('mongoose');
const validator=require('validator')
const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto=require('crypto')
const userSchema =new mongoose.Schema({



  name:{
    type:String,
    required:[true,"Please enter your name"],
    maxLength:[30,"name cannot exeed 30 characters"],
    minLength:[3,"Name Should have more then 3 character"],
  },
  email:{
    type:String,
    required:[true,"Please enter your email"],
    unique:true,
    validate:[validator.isEmail,"Please enter a valid email"],

  },
  password:{
    type:String,
    required:[true,"Please enter your password"],
    minLength:[8,"password should be more then 8 character"],
    select:false,
  },
  avatar:{
    
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }

  },
  role:{
    type:String,
    default:"user"
  },
  resetPasswordToken:String,
  resetPasswordExpire:Date


})
userSchema.pre("save",async function(next){
  if(!this.isModified("password")){
    next();
  }
  this.password=await bcrypt.hash(this.password,10)
})
//jwt token
userSchema.methods.getJWTToken=function(){
  

  return jwt.sign({id:this._id},process.env.JWT_SECRET,{
    expiresIn:process.env.JWT_EXPIRE
  })
}

userSchema.methods.comparePassword=async function(enterpassword){
   return await bcrypt.compare(enterpassword,this.password)
}

//Generating Password Reset Token
userSchema.methods.getResetPasswordToken=function(){
  //Generating Token
  const resetToken=crypto.randomBytes(20).toString("hex");
  //Hashing and Adding Reset Password schema to UserSchema
  this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");
  this.resetPasswordExpire=Date.now()*15*60*1000;
  
}
module.exports=mongoose.model("User",userSchema)
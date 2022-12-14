const { appendFile } = require('fs')
const app=require('./App')
const cloudinary=require("cloudinary")

const dotenv=require("dotenv")
const connectDatabase=require("./config/database")

// handling uncaught exeption
process.on("uncaughtException",(err)=>{
    console.log(`Error:${err.message}`);
    console.log(`shutting down the server due to uncaught exeption`);
    process.exit(1);
})

//config
dotenv.config({path:"backend/config/config.env"})
connectDatabase()

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  

const server=app.listen(process.env.PORT,()=>{
    console.log(`Server is listining at ${process.env.PORT}`)
})

//unhandled promise rejection
process.on("unhandledRejection",(err)=>{
    console.log(`Error:${err.message}`);
    console.log(`shutting down the server due to unhandled rejection`);
    
    server.close(()=>{
        process.exit(1);
    })

})
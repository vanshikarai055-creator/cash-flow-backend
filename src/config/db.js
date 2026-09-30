const mongoose=require("mongoose");
const env=require("./env");

const connectDB=async()=>{
    try{
        await mongoose.connect(env.MONGO_URI);

        console.log("mongoDB connected successfully");

    }
    catch(error){
        console.error("mongoDB connection failed");
        console.error(error.message);

        process.exit(1);
    }
};
module.exports=connectDB;
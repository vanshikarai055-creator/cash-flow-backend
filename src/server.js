const app=require("./app");

const env=require("./config/env");
const connectDB =require("./config/db");

const startServer=async()=>{
    try
    {
        await connectDB();
        app.listen(env.PORT,()=>{
            console.log(`server is running on port ${env.PORT}`);
        })

    }catch(error){
        console.error(
            "Failed to start application"
        )
        process.exit(1);
    }
}
startServer();

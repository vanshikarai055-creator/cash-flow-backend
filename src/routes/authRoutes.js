const express=require("express");
const {registerUser,loginUser}=require("../controllers/authcontroller");
const authMiddleware = require("../middlewares/authmiddleware");
const router= express.Router();
router.post("/register",registerUser);
router.post("/login",loginUser);

router.get("/me",authMiddleware,(req,res)=>{
    return res.status(200).json({
        success:true,
        message:"you are authenticated",
        user:req.user
    });
});
module.exports=router;
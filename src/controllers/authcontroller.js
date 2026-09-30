const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const jwt=require("jsonwebtoken");



const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email,password are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("register error", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const loginUser=async (req,res)=>{
    try{
        const{email,password}=req.body;


        if(!email ||!password){
            return res.status(400).json({
                success:false,
                message:"email and password are required"
            });
        }

        const user=await User.findOne({email}).select("+password");

        if(!user){
            return res.status(401).json({
                success:false,
                message:"invalid email or password"
            });
        }

        const isPasswordCorrect=await bcrypt.compare(
            password,
            user.password
        );

        if(!isPasswordCorrect){
            return res.status(401).json({
                success:false,
                message:"invalid email or password"
            });
        }

        const token=jwt.sign(
            {
                userId:user.id
            },
            process.env.JWT_SECRET,
            {
                expiresIn:process.env.JWT_EXPIRES_IN || "7d"
            }
        );

        return res.status(200).json({
            success:true,
            message:"login successful",
            token,
            user:{
                id:user.id,
                name:user.name,
                email:user.email
            }
        });
    }catch(error){
        console.error("login error",error);

        return res.status(500).json({
            success:false,
            message:"internal server error"
        });
    }
};


module.exports = {
    registerUser,
    loginUser
};
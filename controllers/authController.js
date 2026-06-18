const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { z } = require("zod");

// Validation schemas
const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
});

const forgetPasswordSchema = z.object({
    email: z.string().email("Invalid email format"),
});

const resetPasswordSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters"),
});

exports.register = async (req,res)=>{
    try {
        // Validate request body
        const validation = registerSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: validation.error.errors
            });
        }
        
        const {name,email,password} = validation.data;
        const existedUser = await User.findOne({email});
        if(existedUser){
            return res.status(400).json({message:"User Already Registered"});
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new User({
            name,
            email,
            password:hashedPassword
        });
        await newUser.save();
        res.status(200).json({message:"User Registered Successfully"});
    }catch(err){
        res.status(500).json({message:"Internal Server Error"});
    }
}

exports.login = async (req,res)=>{
    try {
        // Validate request body
        const validation = loginSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: validation.error.errors
            });
        }
        
        const {email,password} = validation.data;
        const db_user = await User.findOne({email});
        if(!db_user){
            return res.status(400).json({"message":"Invalid Credentials"});
        }
        const flag = await bcrypt.compare(password,db_user.password);
        if(!flag){
            return res.status(400).json({"message":"Invalid Credentials"});
        }
        const token = await jwt.sign({id:db_user._id},process.env.JWT_SECRET,{expiresIn:process.env.EXPIRES_IN});
        res.status(200).json({
            message:"Login Successful",
            token
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({"message":"Server Side Error"});
    }
}

exports.forgetPassword = async (req,res)=>{
    try{
        // Validate request body
        const validation = forgetPasswordSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: validation.error.errors
            });
        }
        
        const {email} = validation.data;
        const db_user = await User.findOne({email});
        if(!db_user){
            return res.status(400).json({"message":"User not found"});
        }

        const token = crypto.randomBytes(32).toString("hex");
        db_user.resetToken = token;
        db_user.resetTokenExpire = Date.now() + 10*60*1000;
        await db_user.save();

        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.EMAIL,
                pass:process.env.PASSWORD
            }
        });

        const resetLink = `${process.env.CLIENT_URL || 'http://localhost:5000'}/api/auth/reset-password/${token}`;

        await transporter.sendMail({
            to:db_user.email,
            subject:"Password Reset Link",
            html:`<p>Click Below Link to Reset Password :</p>
                 <a href="${resetLink}">${resetLink}</a>`
        });
        res.status(200).json({"message":"Reset Link Sent Successfully !!!"});

    }catch(err){
        console.log(err);
        res.status(500).json({"message":"Server Side Error"});
    }
}

exports.resetPassword = async (req,res)=>{
    try{
        // Validate request body
        const validation = resetPasswordSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: validation.error.errors
            });
        }
        
        const {password} = validation.data;
        const {token} = req.params;
        const db_user = await User.findOne({
            resetToken:token,
            resetTokenExpire:{$gt:Date.now()}
        })
        if(!db_user){
            return res.status(400).json({"message":"Token Expired and Try Again"})
        }
        const hashedPassword = await bcrypt.hash(password,10);
        db_user.password = hashedPassword;
        db_user.resetToken = undefined;
        db_user.resetTokenExpire = undefined;
        await db_user.save();
        res.status(200).json({"message":"password reset successfully !!!"});
    }catch(err){
        return res.status(500).json({"message":"Internal Server Error"});
    }
}
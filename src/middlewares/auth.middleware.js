import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"

const JwtVerify=await asyncHandler(async (req ,res ,next)=>{
       try {
        // console.log(req);
         const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer"," ");
         
         if(!token){
             throw new ApiError(401 , "Unauthorized token request");
         }
         const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
 
         const user=await User.findById(decodedToken?._id).select("-password -refreshToken");
 
         if(!user){
             throw new ApiError(404,"Invalid Token request");
         }
 
         req.user=user;
 
         next();
       } catch (error) {
           throw new ApiError(401, error?.message || "Invalid token access")
       }
})

export default JwtVerify;
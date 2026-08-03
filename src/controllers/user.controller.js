import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const registerUser=asyncHandler(async (req,res)=>{
    //get user details from frontend
    //Validation Check = whether fields empty or not
    //check if user already exists?= username,email
    //check for images ,check for avatar
    //upload them to cloudinary=avatar
    //create user object = Entry in database
    //remove the password and refreshToken field from response
    //check for user creation
    //return res

    const { username,fullname,email,password }=req.body;

    if(
        [username,fullname,email,password].some((field)=>field?.trim()==="")
    ){
         throw new ApiError(400 , "All fields Are Required");
    }

          const existedUser=await User.findOne({
        $or:[{username},{email}]
      })

      if(existedUser){
        throw new ApiError(409 , "User with email or username already existed");
      }

      const avatarLocalPath = req.files?.avatar[0]?.path;    //req.files is response of multer like req.body is response from url 
      const coverimageLocalPath = req.files?.coverimage[0]?.path;

      if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required");
      }

      const avatar = await uploadOnCloudinary(avatarLocalPath);
      const coverimage = await uploadOnCloudinary(coverimageLocalPath);

      if(!avatar){
        throw new ApiError(404 , "Avatar is Required");
      }

      const user = await User.create({
            username,
            avatar:avatar.url,
            coverimage:coverimage?.url || " ",
            fullname,
            email,
            password
      })

      const createdUser= await User.findOne(user._id).select("-password -refreshToken")

      if(!createdUser){
        throw new ApiError(500 , "Something went wrong while registering the user");
      }

       return res.status(200).json(
        new ApiResponse(200 , createdUser , "User Registered Successfully")
       )



})




    

// export const registerUser=asyncHandler(async (req,res)=>{
//     res.status(200).json({
//         message:"ok",
//     })
// })


// export const createUser=async (req,res)=>{
//     const {username,email,password}=req.body;

//     const user=await User.create({
//         username,email,password
//     });

//     res.status(200).json({
//         message:"User created Successfully",
//         user
//     })
// }


// export const allUsers=async (req,res)=>{

//     // console.log("All users are fetching from database");
//     const users=await User.find();

//     res.status(200).json({
//         message:"All users are got",
//         users:users
//     })
// }

// export const getOneUser=async (req,res)=>{
//     const reqid=req.params.id;

//     const user=await User.findById(reqid);

//     res.status(200).json({
//         message:"Here is the User",
//         user
//     })
// }

// export const updateUser=async (req,res)=>{
//     const reqid=req.params.id;

//     const {username,email,password}=req.body;

//     const user=await User.findByIdAndUpdate(
//         reqid,
//         {
//             username,
//             email,
//             password
//         },{
//             new:true,
//         }
//     );

//     res.status(200).json({
//         message:"The user is updated",
//         user
//     })
// }

// export const deleteUser=async (req,res)=>{
//     const reqid=req.params.id;

//     const user=await User.findByIdAndDelete(reqid);

//     res.status(200).json({
//         message:"User is deleted from database",
//     })
// }
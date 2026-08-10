import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessandRefreshtoken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const AccessToken = user.generateAccessToken();
    const RefreshToken = user.generateRefreshToken();

    user.refreshToken = RefreshToken;
    user.save({ validateBeforeSave: false });
    return { AccessToken, RefreshToken }

  } catch (error) {
    console.error("Token Generation Error: ", error);
    throw new ApiError(500, "Something went wrong while generating access and refresh token")
  }
}



export const registerUser = asyncHandler(async (req, res) => {
  //get user details from frontend
  //Validation Check = whether fields empty or not
  //check if user already exists?= username,email
  //check for images ,check for avatar
  //upload them to cloudinary=avatar
  //create user object = Entry in database
  //remove the password and refreshToken field from response
  //check for user creation
  //return res

  const { username, fullname, email, password } = req.body;

  if (
    [username, fullname, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields Are Required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }]
  })

  if (existedUser) {
    throw new ApiError(409, "User with email or username already existed");
  }
  console.log(req.files)
  const avatarLocalPath = req.files?.avatar?.[0]?.path;    //req.files is response of multer like req.body is response from url 
  const coverimageLocalPath = req.files?.coverimage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverimage = await uploadOnCloudinary(coverimageLocalPath);

  if (!avatar) {
    throw new ApiError(404, "Avatar is Required");
  }

  const user = await User.create({
    username,
    avatar: avatar.url,
    coverimage: coverimage?.url || "",
    fullname,
    email,
    password
  })

  const createdUser = await User.findById(user._id).select("-password -refreshToken")

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res.status(200).json(
    new ApiResponse(200, createdUser, "User Registered Successfully")
  )



})



export const loginUser = asyncHandler(async (req, res) => {
  //req body
  //username or email
  //find the user
  //password check
  //generation of access token and refresh token
  //send a cookie

  const { email, username, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(
      400,
      "Username or email is required"
    );
  }

  if (!password) {
    throw new ApiError(
      400,
      "Password is required"
    );
  }

  const user = await User.findOne({
    $or: [{ username }, { email }]
  })

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Password is incorrect");
  }

  const { AccessToken, RefreshToken } = await generateAccessandRefreshtoken(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  //Sending cookies
  const options = {
    httpOnly: true,
    secure: true,
  }

  return res
    .status(200)
    .cookie("accessToken", AccessToken, options)
    .cookie("refreshToken", RefreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser, AccessToken, RefreshToken,
        },
        "User logged in successfully"
      )
    )



})





export const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1
      }
    }
  )

  res.status(200)
    .clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
    })
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: true
    })
    .json(
      new ApiResponse(200, {}, "User logged Out Successfully")
    )

})




export const refreshAccessToken = asyncHandler(async (req, res) => {
 
    const incomingRefreshToken = req.cookies.refreshToken || req.header("Authorization")?.replace("Bearer ", "");
  
    if (!incomingRefreshToken) {
      throw new ApiError(401, "Refresh Token is not found")
    }
  
  
  let decodedToken;

  try {
    decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    );
  } catch (error) {
    throw new ApiError(401, "Invalid or Expired Refresh Token");
  }
  
  const user = await User.findById(decodedToken._id);
  
  if (!user) {
    throw new ApiError(404, "user is not found in database");
  }
  
  if (user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(401, "Refresh Token is Mismatched");
  }
  
  const { AccessToken, RefreshToken } = await generateAccessandRefreshtoken(user._id);
  
  const options={
    httpOnly:true,
    secure:true,
  }
  res
    .cookie("accessToken", AccessToken,options)
    .cookie("refreshToken", RefreshToken,options)
    .json(
      new ApiResponse(200,
      { AccessToken, RefreshToken },
      "Access Token got refreshed by refresh token"
    )
  
    )
  
})


export const changeCurrentPassword=asyncHandler(async (req,res)=>{
    const {old_password,new_password}=req.body;

    const user=await User.findById(req.user?._id);

    const PasswordCorrect=await user.isPasswordCorrect(old_password);

    if(!PasswordCorrect){
      throw new ApiError(401,"Invalid Old Password");
    }

    user.password=new_password;
    await user.save({validateBeforeSave:false})

    res
    .status(200)
    .json(
      new ApiResponse(200,{},"Password is changed successfully")
    )

})



export const getCurrentUser=asyncHandler(async (req,res)=>{
    res
    .status(200)
    .json(
      new ApiResponse(200,req.user,"Current User fetched Successfully")
    )
})



export const updateAccountDetails=asyncHandler(async (req,res)=>{
   const {fullname,email}=req.body;

   if(!(fullname || email)){
    throw new ApiError(400,"All fiels are required");
   }
   const user=await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        fullname,
        email
      }
    },
    {new:true}
  ).select("-password")

  res.status(200)
  .json(200,user,"Account datails updated successfully");

})



export const updateUserAvatar=asyncHandler(async (req,res)=>{
     const avatarLocalPath=req.file?.path;

     if(!avatarLocalPath){
      throw new ApiError(400,"Avatar file is missing");
     }

     const avatar=await uploadOnCloudinary(avatarLocalPath);

     if(!avatar.url){
      throw new ApiError(400,"Error is uploading file to cloudinary");
     }

    const user=await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set:{
          avatar:avatar.url,
        }
      },
      {new:true}
    ).select("-password")

    res
    .status(200)
    .json(200,{},"Avatar is updated successfully")
})



export const updateUserCoverImage=asyncHandler(async (req,res)=>{
    const coverimageLocalPath=req.file?.path;

    if(!coverimageLocalPath){
      throw new ApiError(400,"CoverImage file is missing");
    }

    const coverimage=await uploadOnCloudinary(coverimageLocalPath);

    if(!coverimage.url){
      throw new ApiError(400,"Error in uploading cover image on cloudinary");
    }

    const user=await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set:{
          coverimage:coverimage.url,
        }
      },{
        new:true,
      }
    ).select("-password")

    res.status(200)
    .json(200,user,"Cover Image Updated Successfully");
})



import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const ConnectDB=async ()=>{
    try{
        // console.log(`url is ${process.env.MONGODB_URI}`);
    const ConnectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`MongoDB is connected and database hosted is = ${ConnectionInstance.connection.host}`);
    }catch(error){
    console.error("Error is = ",error);
    process.exit(1);
    }
}

export default ConnectDB;
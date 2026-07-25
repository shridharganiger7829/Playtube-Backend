import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";

const app=express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));
app.use(express.json({limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

// const app=express();

app.get('/',(req,res)=>{
    res.send("HII SHRIDHAR");
})

export default app;
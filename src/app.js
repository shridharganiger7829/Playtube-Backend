import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import UserRouter from './routes/user.route.js'

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

app.use("/api",UserRouter);


export default app;
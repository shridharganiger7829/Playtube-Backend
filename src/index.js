import dotenv  from "dotenv";
import ConnectDB from "./db/index.js";
import dns from "dns";
import app from "./app.js";

dns.setServers(["1.1.1.1","8.8.8.8"]);

dotenv.config({path:'./.env'});

ConnectDB().
then(()=>{
    app.listen(process.env.PORT || 7000 ,()=>{
        console.log(`Server is running on the port of ${process.env.PORT} `)
    })
}).
catch((error)=>{
    console.error(error);
});
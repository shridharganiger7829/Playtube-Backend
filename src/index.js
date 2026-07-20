import dotenv  from "dotenv";
import ConnectDB from "./db/index.js";
import dns from "dns";

dns.setServers(["1.1.1.1","8.8.8.8"]);

dotenv.config({path:'./env'});

ConnectDB();
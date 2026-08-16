import http from "http";
import app from "./app";

import {initializeSocket}from "./socket/socket";

const server =http.createServer(app);

initializeSocket(server);


server.listen(3000,()=>{

console.log("Server Running on port 3000");

});
const express =require("express")
const  http =require("http")
const { Server } = require('socket.io');
const app=express()
const PORT= 9000

const httpServer=http.createServer(app)
const io = new Server(httpServer,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"]
    }
});
app.get("/health",(req,res)=>{
    res.send({
        status:"ok",
        code:200
    })
})

io.on('connection', (socket) => {
  console.log('a clint connected',socket.id);
});



httpServer.listen(PORT,()=>{
    console.log("server started ",PORT)
})
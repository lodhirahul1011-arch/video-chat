const { loadEnv } = require("./lib/loadEnv")

loadEnv()

const express = require("express")
const http = require("http")
const cors = require("cors")
const config = require("./config/config")
const { Server } = require("socket.io")
const { connectionHandler } = require("./handlers/connectionHandler")
const deliveryApiRouter = require("./routes/deliveryApi.routes")

const app = express()

const corsOptions = {
  origin(origin, callback) {
    if (!origin || config.CORS_ORIGIN.includes(origin)) {
      callback(null, true)
      return
    }

    callback(new Error(`Origin ${origin} is not allowed by CORS`))
  },
  methods: config.CORS_METHODS,
  credentials: true,
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.text({ type: "text/plain" }))
app.use((req, res, next) => {
  if (typeof req.body !== "string") {
    next()
    return
  }

  const rawBody = req.body.trim()
  if (!rawBody) {
    req.body = {}
    next()
    return
  }

  try {
    req.body = JSON.parse(rawBody)
    next()
  } catch {
    res.status(400).json({
      error: "Invalid JSON payload",
    })
  }
})

app.use("/delivery-api", deliveryApiRouter)

app.get("/", (_req, res) => {
  res.json({
    service: "video-chat-backend",
    status: "ok",
    allowedOrigins: config.CORS_ORIGIN,
    deliveryApi: "/delivery-api",
  })
})

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" })
})

app.get("/api/room", (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: "Socket server is ready",
    },
  })
})

const httpServer = http.createServer(app)
const io = new Server(httpServer, {
  cors: corsOptions,
})

connectionHandler(io)

// io.on('connection', (socket) => {
//   console.log('a clint connected',socket.id);




//   socket.on("sender",(senderData)=>{
//         const{targetId,message}=senderData
//         console.log(targetId ,message)
//         io.to(targetId).emit("receiver",{
//             sender:socket.id,
//             message:message
//         })

//   })


//   // Offer ko ek client se dusre client tak forward karna
//   // Client A offer bhejta hai, hum use Client B tak forward karte hain
//   socket.on("offer",(data)=>{
//     console.log("Offer received from:",socket.id,"forwarding to:",data.targetId)
//     // Target client ko offer forward karo with sender info
//     io.to(data.targetId).emit("offer",{
//         offer:data.offer,
//         sender:socket.id  // Kis ne bheja ye batane ke liye
//     })
//   })

//   // Answer ko ek client se dusre client tak forward karna
//   // Client B answer bhejta hai, hum use Client A tak forward karte hain
//   socket.on("answer",(data)=>{
//     console.log("Answer received from:",socket.id,"forwarding to:",data.targetId)
//     // Target client ko answer forward karo with sender info
//     io.to(data.targetId).emit("answer",{
//         answer:data.answer,
//         sender:socket.id  // Kis ne bheja ye batane ke liye
//     })
//   })

//   // ICE candidate ko ek client se dusre client tak forward karna
//   // Jab ek client apna ICE candidate bhejta hai, hum use target client tak forward karte hain
//   socket.on("ice-candidate",(data)=>{
//     console.log("ICE candidate received from:",socket.id,"forwarding to:",data.targetId)
//     // Target client ko ICE candidate forward karo with sender info
//     io.to(data.targetId).emit("ice-candidate",{
//         candidate:data.candidate,
//         sender:socket.id  // Kis ne bheja ye batane ke liye
//     })
//   })

  
// });

let currentPort = config.PORT;

const startServer = (port) => {
    currentPort = port;
    httpServer.listen(port);
};

httpServer.on("listening", () => {
    console.log("server started", currentPort);
});

httpServer.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
        const nextPort = currentPort + 1;
        console.log(`Port ${currentPort} is in use, retrying on ${nextPort}`);
        startServer(nextPort);
        return;
    }

    throw error;
});

startServer(currentPort);

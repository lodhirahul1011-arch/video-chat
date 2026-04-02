// server.js or app.js
require("dotenv").config(); // ✅ Load .env variables

const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

// ✅ Import routes
const AuthRoute = require("./routes/auth.routes");
const PostRoute = require("./routes/post.route");
const UserRoute = require("./routes/user.route");
const ChatRoute = require("./routes/chat.routes");
const TrackRoute = require("./routes/track.routes");
const SubLabelRoute = require("./routes/sublabel.routes");
const AdminRoute = require("./routes/admin.routes");

const app = express();

// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://videochat-front.vercel.app/login", 
];

// ✅ CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // null origin = Postman / server-to-server requests
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // allow cookies/auth headers
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// ✅ Apply CORS globally
app.use(cors(corsOptions));

// ✅ Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ API Routes
app.use("/api/auth", AuthRoute);
app.use("/api/post", PostRoute);
app.use("/api/user", UserRoute);
app.use("/api/chats", ChatRoute);
app.use("/api/tracks", TrackRoute);
app.use("/api/sublabels", SubLabelRoute);
app.use("/api/admin", AdminRoute);

// ✅ Root route (optional)
app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;

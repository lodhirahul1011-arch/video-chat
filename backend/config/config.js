module.exports = {
    PORT: Number(process.env.PORT) || 9000,
    CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
    CORS_METHODS: ["GET", "POST"]
}

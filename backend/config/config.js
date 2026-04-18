const parseOrigins = (...values) =>
  values
    .flatMap((value) => (value || "").split(","))
    .map((value) => value.trim())
    .filter(Boolean)

const corsOrigins = parseOrigins(
  process.env.CORS_ORIGIN,
  process.env.CORS_ORIGINS,
  process.env.FRONTEND_URL
)

module.exports = {
  PORT: Number(process.env.PORT) || 9000,
  CORS_ORIGIN: corsOrigins.length ? corsOrigins : ["http://localhost:5173"],
  CORS_METHODS: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
}

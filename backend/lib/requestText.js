const http = require("http")
const https = require("https")

const requestText = (inputUrl) =>
  new Promise((resolve, reject) => {
    const target =
      typeof inputUrl === "string" ? new URL(inputUrl) : new URL(inputUrl.toString())

    const client = target.protocol === "http:" ? http : https

    const req = client.get(target, (res) => {
      const chunks = []

      res.on("data", (chunk) => chunks.push(chunk))
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode || 500,
          headers: res.headers,
          body: Buffer.concat(chunks).toString("utf8"),
        })
      })
    })

    req.on("error", reject)
    req.setTimeout(15000, () => {
      req.destroy(new Error("SMS provider request timed out"))
    })
  })

module.exports = {
  requestText,
}

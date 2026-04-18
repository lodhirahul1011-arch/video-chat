const fs = require("fs")
const path = require("path")

let envLoaded = false

const stripWrappingQuotes = (value) => {
  if (!value) {
    return value
  }

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1)
  }

  return value
}

const loadEnv = (envPath = path.join(__dirname, "..", ".env")) => {
  if (envLoaded) {
    return
  }

  envLoaded = true

  if (!fs.existsSync(envPath)) {
    return
  }

  const content = fs.readFileSync(envPath, "utf8")
  const lines = content.split(/\r?\n/)

  for (const line of lines) {
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue
    }

    const normalized = trimmed.startsWith("export ")
      ? trimmed.slice(7).trim()
      : trimmed

    const separatorIndex = normalized.indexOf("=")
    if (separatorIndex === -1) {
      continue
    }

    const key = normalized.slice(0, separatorIndex).trim()
    if (!key || process.env[key] !== undefined) {
      continue
    }

    const value = normalized.slice(separatorIndex + 1).trim()
    process.env[key] = stripWrappingQuotes(value)
  }
}

module.exports = {
  loadEnv,
}

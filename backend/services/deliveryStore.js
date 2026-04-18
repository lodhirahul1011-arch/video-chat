const fs = require("fs/promises")
const path = require("path")
const { randomUUID } = require("crypto")

const STORE_DIR = path.join(__dirname, "..", "data")
const STORE_FILE = path.join(STORE_DIR, "delivery-store.json")

const DEFAULT_STORE = {
  numbers: [],
  logs: [],
}

let writeQueue = Promise.resolve()

const ensureStore = async () => {
  await fs.mkdir(STORE_DIR, { recursive: true })

  try {
    await fs.access(STORE_FILE)
  } catch {
    await fs.writeFile(STORE_FILE, JSON.stringify(DEFAULT_STORE, null, 2), "utf8")
  }
}

const normalizeStore = (store) => ({
  numbers: Array.isArray(store?.numbers) ? store.numbers : [],
  logs: Array.isArray(store?.logs) ? store.logs : [],
})

const readStore = async () => {
  await ensureStore()

  try {
    const raw = await fs.readFile(STORE_FILE, "utf8")
    return normalizeStore(JSON.parse(raw))
  } catch {
    return { ...DEFAULT_STORE }
  }
}

const writeStore = async (store) => {
  await ensureStore()
  await fs.writeFile(STORE_FILE, JSON.stringify(store, null, 2), "utf8")
}

const queueWrite = async (callback) => {
  const currentTask = writeQueue.then(async () => {
    const store = await readStore()
    const result = await callback(store)
    await writeStore(store)
    return result
  })

  writeQueue = currentTask.then(
    () => undefined,
    () => undefined
  )

  return currentTask
}

const sortNewestFirst = (items) =>
  [...items].sort((left, right) => {
    if (Boolean(left.is_active) !== Boolean(right.is_active)) {
      return Number(Boolean(right.is_active)) - Number(Boolean(left.is_active))
    }

    return (
      new Date(right.created_at || 0).getTime() -
      new Date(left.created_at || 0).getTime()
    )
  })

const getNumbers = async () => {
  const store = await readStore()
  return sortNewestFirst(store.numbers)
}

const getActiveNumber = async () => {
  const numbers = await getNumbers()
  return numbers.find((number) => number.is_active) || numbers[0] || null
}

const saveNumber = async ({ number, label = "" }) =>
  queueWrite(async (store) => {
    const now = new Date().toISOString()
    const cleanNumber = String(number || "").trim()
    const cleanLabel = String(label || "").trim()

    let saved = store.numbers.find((item) => item.number === cleanNumber)

    store.numbers = store.numbers.map((item) => ({
      ...item,
      is_active: false,
    }))

    if (saved) {
      saved = {
        ...saved,
        number: cleanNumber,
        label: cleanLabel,
        is_active: true,
      }

      store.numbers = store.numbers.map((item) =>
        item.id === saved.id ? saved : item
      )
      return saved
    }

    saved = {
      id: randomUUID(),
      number: cleanNumber,
      label: cleanLabel,
      is_active: true,
      created_at: now,
    }

    store.numbers.unshift(saved)
    return saved
  })

const deleteNumber = async (id) =>
  queueWrite(async (store) => {
    const index = store.numbers.findIndex((item) => item.id === id)
    if (index === -1) {
      return null
    }

    const [removed] = store.numbers.splice(index, 1)
    if (removed?.is_active && store.numbers[0]) {
      store.numbers[0] = {
        ...store.numbers[0],
        is_active: true,
      }
    }

    return removed
  })

const getLogs = async () => {
  const store = await readStore()
  return [...store.logs].sort(
    (left, right) =>
      new Date(right.created_at || 0).getTime() -
      new Date(left.created_at || 0).getTime()
  )
}

const appendLog = async (log) =>
  queueWrite(async (store) => {
    store.logs.unshift(log)
    store.logs = store.logs.slice(0, 200)
    return log
  })

const clearLogs = async () =>
  queueWrite(async (store) => {
    store.logs = []
    return true
  })

module.exports = {
  STORE_FILE,
  appendLog,
  clearLogs,
  deleteNumber,
  getActiveNumber,
  getLogs,
  getNumbers,
  saveNumber,
}

const express = require("express")
const {
  appendLog,
  clearLogs,
  deleteNumber,
  getActiveNumber,
  getLogs,
  getNumbers,
  saveNumber,
} = require("../services/deliveryStore")
const {
  buildDeliveryPayload,
  buildSmsMessage,
  createSmsLog,
  sanitizePhoneNumber,
  sendSmsWithProvider,
} = require("../services/deliverySmsService")

const router = express.Router()

const asyncRoute = (handler) => async (req, res) => {
  try {
    await handler(req, res)
  } catch (error) {
    console.error("delivery-api error:", error)
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    })
  }
}

router.get(
  "/health",
  asyncRoute(async (_req, res) => {
    res.json({
      status: "ok",
      service: "delivery-api",
    })
  })
)

router.get(
  "/numbers",
  asyncRoute(async (_req, res) => {
    const numbers = await getNumbers()
    res.json({ data: numbers })
  })
)

router.post(
  "/numbers",
  asyncRoute(async (req, res) => {
    if (!req.body?.number) {
      res.status(400).json({
        error: "Phone number is required",
      })
      return
    }

    const phoneNumber = sanitizePhoneNumber(req.body?.number)
    const saved = await saveNumber({
      number: phoneNumber,
      label: req.body?.label,
    })

    res.status(201).json({ data: saved })
  })
)

router.delete(
  "/numbers/:id",
  asyncRoute(async (req, res) => {
    const deleted = await deleteNumber(req.params.id)

    if (!deleted) {
      res.status(404).json({
        code: "NOT_FOUND",
        error: "Saved number not found",
      })
      return
    }

    res.json({ success: true })
  })
)

router.post(
  "/send-sms",
  asyncRoute(async (req, res) => {
    const buttonLabel = String(req.body?.button_label || "").trim() || "Delivery"
    const explicitPhone = req.body?.phone_number
    const activeNumber = explicitPhone ? null : await getActiveNumber()

    if (!explicitPhone && !activeNumber?.number) {
      res.status(400).json({
        error: "Save a phone number first",
      })
      return
    }

    const phoneNumber = sanitizePhoneNumber(
      explicitPhone || activeNumber?.number || ""
    )

    const generated = buildDeliveryPayload()
    const message = buildSmsMessage(generated)
    const providerResult = await sendSmsWithProvider({
      phoneNumber,
      message,
    })

    const log = createSmsLog({
      phoneNumber,
      buttonLabel,
      generated,
      message,
      providerResult,
    })

    await appendLog(log)

    res.json({
      success: providerResult.success,
      data: {
        ...log,
        generated: {
          orderId: generated.orderId,
          awb: generated.awb,
          otp: generated.otp,
          timeSlot: generated.timeSlot,
          message,
        },
      },
    })
  })
)

router.get(
  "/logs",
  asyncRoute(async (_req, res) => {
    const logs = await getLogs()
    res.json({ data: logs })
  })
)

router.post(
  "/logs/clear",
  asyncRoute(async (_req, res) => {
    await clearLogs()
    res.json({ success: true })
  })
)

module.exports = router

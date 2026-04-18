const { randomInt, randomUUID } = require("crypto")
const { requestText } = require("../lib/requestText")

const TIME_SLOTS = ["11 AM", "1 PM", "3 PM", "5 PM", "7 PM", "9 PM"]

const DEFAULT_SMS_TEMPLATE =
  "Dvaarikart:Your order{ORDER_ID}(AWB:{AWB}) is out for delivery. Open Box Delivery OTP:{OTP}valid till{TIME}today. Please share OTP after checking the product condition. Delivery Partner: Dvaarikart - GRAHNETRA AI LABS"

const DIGIT_ONLY_REGEX = /\D/g
const PROVIDER_FAILURE_HINTS = [
  "error",
  "failed",
  "invalid",
  "denied",
  "rejected",
  "insufficient",
  "not sent",
  "not submit",
]

const randomDigits = (length) =>
  Array.from({ length }, () => randomInt(0, 10)).join("")

const sanitizePhoneNumber = (input) => {
  const digits = String(input || "").replace(DIGIT_ONLY_REGEX, "")

  if (digits.length === 10) {
    return digits
  }

  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(2)
  }

  throw new Error("Please enter a valid Indian mobile number")
}

const formatPhoneForProvider = (number) => sanitizePhoneNumber(number)

const pickRandomTimeSlot = () => TIME_SLOTS[randomInt(0, TIME_SLOTS.length)]

const buildDeliveryPayload = () => ({
  orderId: `OD${randomDigits(12)}`,
  awb: `FMPP${randomDigits(12)}`,
  otp: randomDigits(6),
  timeSlot: pickRandomTimeSlot(),
})

const replaceFirstSequentialPlaceholder = (template, value) =>
  template.replace(/\(var\)|\{var\}|\[var\]|\{#var#\}/i, value)

const buildSmsMessage = ({ orderId, awb, otp, timeSlot }) => {
  let message =
    process.env.SMS_MESSAGE_TEMPLATE?.trim() || DEFAULT_SMS_TEMPLATE

  const replacements = [
    [/#ORDER_ID#/g, orderId],
    [/#AWB#/g, awb],
    [/#OTP#/g, otp],
    [/#TIME#/g, timeSlot],
    [/\{ORDER_ID\}/g, orderId],
    [/\{AWB\}/g, awb],
    [/\{OTP\}/g, otp],
    [/\{TIME\}/g, timeSlot],
    [/\{\{ORDER_ID\}\}/g, orderId],
    [/\{\{AWB\}\}/g, awb],
    [/\{\{OTP\}\}/g, otp],
    [/\{\{TIME\}\}/g, timeSlot],
  ]

  for (const [pattern, value] of replacements) {
    message = message.replace(pattern, value)
  }

  const sequentialValues = [orderId, awb, otp, timeSlot]
  for (const value of sequentialValues) {
    message = replaceFirstSequentialPlaceholder(message, value)
  }

  return message.trim()
}

const parseProviderBody = (body) => {
  if (!body) {
    return null
  }

  try {
    return JSON.parse(body)
  } catch {
    return body
  }
}

const isProviderSuccess = (statusCode, parsedBody, rawBody) => {
  if (statusCode < 200 || statusCode >= 300) {
    return false
  }

  if (parsedBody && typeof parsedBody === "object" && !Array.isArray(parsedBody)) {
    const candidate = parsedBody

    if (candidate.success === false || candidate.status === "failed") {
      return false
    }

    if (typeof candidate.error === "string") {
      return false
    }

    if (
      typeof candidate.message === "string" &&
      PROVIDER_FAILURE_HINTS.some((hint) =>
        candidate.message.toLowerCase().includes(hint)
      )
    ) {
      return false
    }
  }

  const text = String(rawBody || "").toLowerCase()
  return !PROVIDER_FAILURE_HINTS.some((hint) => text.includes(hint))
}

const sendSmsWithProvider = async ({ phoneNumber, message }) => {
  const apiKey = process.env.SMS_API_KEY?.trim()
  const senderId = process.env.SMS_SENDER_ID?.trim()
  const templateId = process.env.SMS_TEMPLATE_ID?.trim()
  const baseUrl = process.env.SMS_BASE_URL?.trim()

  if (!apiKey || !senderId || !templateId || !baseUrl) {
    return {
      success: false,
      apiResponse: {
        error:
          "SMS credentials not configured. Set SMS_API_KEY, SMS_SENDER_ID, SMS_TEMPLATE_ID, and SMS_BASE_URL.",
      },
    }
  }

  try {
    const requestUrl = new URL(baseUrl)
    requestUrl.searchParams.set("apikey", apiKey)
    requestUrl.searchParams.set("senderid", senderId)
    requestUrl.searchParams.set("templateid", templateId)
    requestUrl.searchParams.set("number", formatPhoneForProvider(phoneNumber))
    requestUrl.searchParams.set("message", message)

    const response = await requestText(requestUrl)
    const parsedBody = parseProviderBody(response.body)

    return {
      success: isProviderSuccess(response.statusCode, parsedBody, response.body),
      apiResponse: {
        statusCode: response.statusCode,
        body: parsedBody,
        provider: "smsfortius",
        request: {
          base_url: `${requestUrl.origin}${requestUrl.pathname}`,
          sender_id: senderId,
          template_id: templateId,
          phone_number: formatPhoneForProvider(phoneNumber),
        },
      },
    }
  } catch (error) {
    return {
      success: false,
      apiResponse: {
        error:
          error instanceof Error
            ? error.message
            : "Failed to connect to SMS provider",
      },
    }
  }
}

const createSmsLog = ({
  phoneNumber,
  buttonLabel,
  generated,
  message,
  providerResult,
}) => ({
  id: randomUUID(),
  phone_number: sanitizePhoneNumber(phoneNumber),
  button_label: buttonLabel,
  order_id: generated.orderId,
  awb: generated.awb,
  otp: generated.otp,
  time_slot: generated.timeSlot,
  message_text: message,
  status: providerResult.success ? "submitted" : "failed",
  api_response: providerResult.apiResponse,
  created_at: new Date().toISOString(),
})

module.exports = {
  buildDeliveryPayload,
  buildSmsMessage,
  createSmsLog,
  sanitizePhoneNumber,
  sendSmsWithProvider,
}

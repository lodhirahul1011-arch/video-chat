function getApiMessage(apiResponse: unknown): string | null {
  if (!apiResponse) return null;

  if (typeof apiResponse === "string") {
    return apiResponse;
  }

  if (typeof apiResponse !== "object") {
    return null;
  }

  const response = apiResponse as Record<string, unknown>;
  const body =
    response.body && typeof response.body === "object"
      ? (response.body as Record<string, unknown>)
      : null;

  return typeof response.error === "string" ? response.error :
    typeof response.message === "string" ? response.message :
    typeof response.description === "string" ? response.description :
    typeof body?.error === "string" ? body.error :
    typeof body?.message === "string" ? body.message :
    typeof body?.description === "string" ? body.description :
    typeof response.body === "string" ? response.body :
    null;
}

export function getSmsFailureMessage(apiResponse: unknown): string | null {
  const error = getApiMessage(apiResponse);

  if (!error) {
    return null;
  }

  if (error.includes("SMS credentials not configured")) {
    return "Backend me SMS config missing hai. `SMS_API_KEY`, `SMS_SENDER_ID`, `SMS_TEMPLATE_ID`, aur `SMS_BASE_URL` set karo.";
  }

  if (error.includes("FAST2SMS_API_KEY not configured")) {
    return "Backend me legacy `FAST2SMS_API_KEY` secret missing hai.";
  }

  return error;
}

export function getSmsSubmissionMessage(apiResponse: unknown): string | null {
  const message = getApiMessage(apiResponse);

  if (!message) {
    return null;
  }

  const lower = message.toLowerCase();
  if (
    lower.includes("submitted") ||
    lower.includes("success") ||
    lower.includes("accepted")
  ) {
    return `${message}. Provider ne request accept kar li hai, handset delivery ab operator/DLT par depend karegi.`;
  }

  return null;
}

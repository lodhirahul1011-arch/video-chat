// Mock auth actions for Login and Signup pages
export const loginUserApi = async (data) => {
  try {
    // Mock login - store email in localStorage
    localStorage.setItem("userEmail", data.email)
    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false }
  }
}

export const fetchRegisterApi = async (data) => {
  try {
    // Mock signup - store email in localStorage
    localStorage.setItem("userEmail", data.email)
    return { success: true }
  } catch (error) {
    console.error("Signup error:", error)
    return { success: false }
  }
}

const getBackendUrl = () => {
  return (import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || "http://localhost:5000").replace(/\/+$/, "")
}

export const fetchRoomData = async () => {
  try {
    const res = await fetch(`${getBackendUrl()}/api/room`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
    })

    if (!res.ok) {
      throw new Error(`Room fetch failed: ${res.status}`)
    }

    const data = await res.json()
    return { success: true, data }
  } catch (error) {
    console.error("fetchRoomData error:", error)
    return { success: false, error: error.message }
  }
}

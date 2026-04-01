// Mock auth actions for Login and Signup pages
export const loginUserApi = (data) => (dispatch) => {
  try {
    // Mock login - store email in localStorage
    localStorage.setItem("userEmail", data.email)
    return Promise.resolve({ success: true })
  } catch (error) {
    console.error("Login error:", error)
    return Promise.resolve({ success: false })
  }
}

export const fetchRegisterApi = (data) => (dispatch) => {
  try {
    // Mock signup - store email in localStorage
    localStorage.setItem("userEmail", data.email)
    return Promise.resolve({ success: true })
  } catch (error) {
    console.error("Signup error:", error)
    return Promise.resolve({ success: false })
  }
}

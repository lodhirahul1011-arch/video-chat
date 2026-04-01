import { configureStore } from '@reduxjs/toolkit'

// Minimal store configuration
export const store = configureStore({
  reducer: {
    auth: (state = {}, action) => state,
  }
})

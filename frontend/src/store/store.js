import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/reducers/AuthSlice'

// Minimal store configuration
export const store = configureStore({
  reducer: {
    auth: authReducer,
  }
})

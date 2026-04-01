import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import './globals.css'
import './index.css'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import { store } from './store/store.js'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/user-dashboard" element={<App />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  </Provider>
)

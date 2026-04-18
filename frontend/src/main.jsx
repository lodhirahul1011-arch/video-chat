import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom"
import App from "./App.jsx"
import "./globals.css"
import "./index.css"
import DashboardHome from "./pages/DashboardHome.jsx"
import Login from "./pages/Login.jsx"
import Signup from "./pages/Signup.jsx"
import SmsToolPage from "./pages/SmsToolPage.jsx"
import { store } from "./store/store.js"

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/user-dashboard" element={<App />}>
          <Route index element={<DashboardHome />} />
          <Route path="sms" element={<SmsToolPage />} />
        </Route>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  </Provider>
)

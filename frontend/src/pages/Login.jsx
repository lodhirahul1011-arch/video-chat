import { Eye, EyeOff, Lock, User } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { loginUserApi } from "../features/actions/AuthAction"

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (data) => {
    try {
      const response = await loginUserApi(data)

      if (response?.success) {
        localStorage.setItem("userName", data.email.split("@")[0] || "User")
        navigate("/user-dashboard")
        return
      }

      alert("Invalid credentials")
    } catch (error) {
      console.error(error)
      alert("Login failed")
    }
  }

  const continueGuest = () => {
    localStorage.setItem("userName", "Guest")
    navigate("/user-dashboard")
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dbeafe_0%,#f8fafc_35%,#eef2ff_100%)] px-4 py-10">
      <div className="container-page">
        <div className="grid items-stretch gap-8 lg:grid-cols-2">
          <div className="glass relative hidden overflow-hidden p-10 lg:block">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(37,99,235,0.12),rgba(168,85,247,0.18))]" />
            <div className="relative">
              <h1 className="text-5xl font-semibold tracking-tight text-slate-900">
                Welcome<span className="text-neon">.</span>
              </h1>
              <p className="mt-4 max-w-md text-[color:var(--muted)]">
                Sign in to access your dashboard, video calls, chat console, and
                delivery SMS workspace in one place.
              </p>
            </div>
          </div>

          <div className="glass p-8 md:p-10">
            <h2 className="text-2xl font-semibold text-slate-900">Sign in</h2>
            <p className="mt-1 text-sm text-[color:var(--muted)]">
              Use your email and password to continue.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <div>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted)]" />
                  <input
                    className="input-ui pl-11"
                    placeholder="Email"
                    type="email"
                    {...register("email", { required: "Email is required" })}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted)]" />
                  <input
                    className="input-ui pl-11 pr-12"
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[color:var(--muted)] transition-colors hover:bg-black/10 hover:text-[color:var(--text)]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button className="btn-primary w-full" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Signing in..." : "Submit"}
              </button>

              <div className="flex items-center justify-between text-sm text-[color:var(--muted)]">
                <span>Demo auth is enabled for this build.</span>
                <Link to="/signup" className="hover:text-[color:var(--text)]">
                  Create account
                </Link>
              </div>
            </form>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button type="button" onClick={continueGuest} className="btn-ghost w-full">
                Continue as Guest
              </button>
              <Link
                to="/signup"
                className="rounded-lg bg-violet-100 py-2 text-center font-semibold text-violet-700 transition hover:bg-violet-200"
              >
                Signup
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

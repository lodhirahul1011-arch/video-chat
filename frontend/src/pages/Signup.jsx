import { Eye, EyeOff, Lock, Mail, User } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { fetchRegisterApi } from "../features/actions/AuthAction"

function Signup() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (data) => {
    try {
      const response = await fetchRegisterApi(data)

      if (response?.success) {
        localStorage.setItem("userName", data.fullName)
        navigate("/login")
        return
      }

      alert("Signup failed")
    } catch (error) {
      console.error(error)
      alert("Signup failed")
    }
  }

  const continueGuest = () => {
    localStorage.setItem("userName", "Guest")
    navigate("/user-dashboard")
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,#e0f2fe_0%,#f8fafc_35%,#ede9fe_100%)] px-4 py-10">
      <div className="container-page">
        <div className="glass mx-auto max-w-2xl p-8 md:p-10">
          <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
            Create <span className="text-neon">Account</span>
          </h1>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            Start using video chat and the delivery SMS workspace from one
            dashboard.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            <div className="md:col-span-2">
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted)]" />
                <input
                  className="input-ui pl-11"
                  placeholder="Full name"
                  {...register("fullName", {
                    required: "Full name is required",
                  })}
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted)]" />
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

            <div className="md:col-span-2">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted)]" />
                <input
                  className="input-ui pl-11 pr-12"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Min 6 characters",
                    },
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

            <div className="md:col-span-2">
              <button className="btn-primary w-full" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button onClick={continueGuest} className="btn-ghost w-full">
              Continue as Guest
            </button>
            <Link
              to="/login"
              className="rounded-lg bg-violet-100 py-2 text-center font-semibold text-violet-700 transition hover:bg-violet-200"
            >
              Already have account?
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup

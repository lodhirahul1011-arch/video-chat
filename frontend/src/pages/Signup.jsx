import { useForm } from "react-hook-form";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchRegisterApi } from "../features/actions/AuthAction";
import { Mail, User, Lock, Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await dispatch(fetchRegisterApi(data));
      if (res?.success) {
        localStorage.setItem("userName", data.fullName)
        navigate("/login")
      } else alert("Signup failed")
    } catch (e) {
      console.error(e);
      alert("Signup failed");
    }
  };

  const continueGuest = () => {
    localStorage.setItem("userName", "Guest")
    navigate("/user-dashboard")
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="container-page">
        <div className="glass p-8 md:p-10 max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-semibold">
            Create <span className="text-neon">Account</span>
          </h1>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            Start distributing your music and managing everything from one dashboard.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <User className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--muted)] opacity-90" />
                <input
                  className="input-ui pl-11"
                  placeholder="Full name"
                  {...register("fullName", { required: "Full name is required" })}
                />
              </div>
              {errors.fullName && <p className="mt-1 text-sm text-red-400">{errors.fullName.message}</p>}
            </div>

            <div className="md:col-span-2">
              <div className="relative">
                <Mail className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--muted)] opacity-90" />
                <input
                  className="input-ui pl-11"
                  placeholder="Email"
                  type="email"
                  {...register("email", { required: "Email is required" })}
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
            </div>

            <div className="md:col-span-2">
              <div className="relative">
                <Lock className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--muted)] opacity-90" />
                <input
                  className="input-ui pl-11 pr-12"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg text-[color:var(--muted)] hover:text-[color:var(--text)] hover:bg-black/10 dark:hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
              {showPassword ? (
  <EyeOff className="h-4 w-4" />
) : (
  <Eye className="h-4 w-4" />
)}

                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>}
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
            <Link to="/login" className="text-center py-2 rounded-lg bg-violet-100 hover:bg-violet-200 text-violet-700 font-semibold">
              Already have account?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

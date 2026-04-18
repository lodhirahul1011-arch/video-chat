import { useEffect, useMemo, useState } from "react"
import {
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  Sparkles,
  Video,
  X,
} from "lucide-react"
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom"

const navigationItems = [
  {
    to: "/user-dashboard",
    label: "Dashboard",
    description: "Video room and live chat",
    icon: LayoutDashboard,
    match: (pathname) => pathname === "/user-dashboard",
  },
  {
    to: "/user-dashboard/sms",
    label: "SMS Tool",
    description: "Delivery notification panel",
    icon: MessageSquareText,
    match: (pathname) => pathname.startsWith("/user-dashboard/sms"),
  },
]

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const currentUserName = localStorage.getItem("userName") || "Guest"
  const currentSection =
    useMemo(
      () =>
        navigationItems.find((item) => item.match(location.pathname)) ??
        navigationItems[0],
      [location.pathname]
    )

  useEffect(() => {
    setIsSidebarOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userName")
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[2px] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-80 max-w-[86vw] flex-col border-r border-slate-200 bg-white/95 px-5 py-6 shadow-2xl shadow-slate-200/70 backdrop-blur transition-transform duration-300 lg:w-72 lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-500 to-cyan-400 text-white shadow-lg shadow-blue-200">
              <Video size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-500">
                Workspace
              </p>
              <h1 className="text-lg font-bold text-slate-900">Motox Hub</h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-8 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Welcome back, {currentUserName}
              </p>
              <p className="text-xs text-slate-500">
                Manage calls and SMS tools from one place.
              </p>
            </div>
          </div>
        </div>

        <nav className="mt-8 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/user-dashboard"}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all ${
                    isActive
                      ? "border-blue-200 bg-blue-50 text-blue-700 shadow-sm shadow-blue-100"
                      : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-colors ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-500 group-hover:bg-white"
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.description}</p>
                    </div>
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>

        <div className="mt-auto rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Active Section
          </p>
          <p className="mt-2 text-base font-semibold text-slate-900">
            {currentSection.label}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {currentSection.description}
          </p>

          <button
            onClick={handleLogout}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <main className="min-h-screen lg:ml-72">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsSidebarOpen((prev) => !prev)}
                className="rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm lg:hidden"
                aria-label="Toggle navigation"
              >
                <Menu size={18} />
              </button>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-500">
                  Motox Control
                </p>
                <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                  {currentSection.label}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-right sm:block">
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
                  Signed in
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {currentUserName}
                </p>
              </div>

              <div className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 ring-1 ring-green-100">
                Live workspace
              </div>
            </div>
          </div>
        </header>

        <div className="min-h-[calc(100vh-81px)]">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default App

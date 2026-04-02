import ChatSection from "./components/ChatSection"
import VideoSection from "./components/VideoSection"
import useSocket from "./hooks/useSocket"
import useChat from "./hooks/useChat"
import useCamera from "./hooks/useCamera"
import useWebRTC from "./hooks/useWebRTC"
import { useNavigate } from "react-router-dom"
import { LogOut, Menu, X } from "lucide-react"
import { useState } from "react"

function App() {
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("userEmail")
    navigate("/login")
  }

  // Custom hooks use karo - sab logic hooks me hai
  const { socketID, socket } = useSocket()
  
const currentUserName = localStorage.getItem("userName") || "You"

  const {
    targetId, 
    setTargetId, 
    message, 
    setMessage, 
    allMessage, 
    sendMessage 
  } = useChat(socket, currentUserName)
  
  const { 
    localVideoStream, 
    localVideoRef, 
    getCamera,
    cameraError,
    isRequestingCamera,
  } = useCamera()
  
  const { 
    remoteVideoRef, 
    sendOffer 
  } = useWebRTC(socket, localVideoStream, getCamera)
  
  // Offer send karne ka wrapper function
  const handleSendOffer = () => {
    if (targetId) {
      sendOffer(targetId)
    } else {
      alert("Please enter target ID first")
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Mobile overlay when sidebar open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`z-50 fixed inset-y-0 left-0 w-72 bg-white border-r border-gray-200 p-4 lg:p-6 flex flex-row lg:flex-col items-center lg:items-start gap-4 lg:gap-0 transition-transform duration-300 ease-in-out transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:translate-x-0 lg:w-56 lg:z-30`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            M
          </div>
          <span className="text-xl font-bold text-gray-900">motox</span>
        </div>
        <nav className="space-y-2 flex-1 w-full">
          <div className="px-3 py-2 rounded-lg bg-gray-100 text-gray-900 font-medium cursor-pointer text-center lg:text-left">Dashboard</div>
          <div className="px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer text-center lg:text-left">Conferences</div>
          <div className="px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer text-center lg:text-left">Calendar</div>
          <div className="px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer text-center lg:text-left">Settings</div>
        </nav>
        <div className="border-t lg:border-t-0 border-gray-200 lg:mt-auto w-full pt-4">
          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Insights</h4>
          <div className="space-y-2">
            <div className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer">Inbox</div>
            <div className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer">Notifications</div>
            <div className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer">Comments</div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full mt-6 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 border border-red-200 hover:border-red-300"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden lg:ml-72">        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Design Meeting</h1>
            <div className="text-sm text-gray-600 mt-2 flex flex-wrap items-center gap-2">
              <span>Your Peer ID:</span>
              {socketID ? (
                <span className="font-mono font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-lg text-xs sm:text-sm">
                  {socketID}
                </span>
              ) : (
                <span className="text-gray-400 italic">Connecting...</span>
              )}
            </div>
          </div>
            <div className="flex items-center justify-between w-full md:w-auto">
            <button
              className="p-2 rounded-lg bg-gray-100 text-gray-700 lg:hidden"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              {socketID && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(socketID)
                    alert("Peer ID copied to clipboard!")
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg text-white rounded-lg text-sm font-medium transition-all"
                >
                  Copy My ID
                </button>
              )}
              <div className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium text-center">
                Administrator
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-8 space-y-6">
            {/* Video & Chat Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[20rem]">
              <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <VideoSection
                  localVideoRef={localVideoRef}
                  remoteVideoRef={remoteVideoRef}
                  localVideoStream={localVideoStream}
                  cameraError={cameraError}
                  isRequestingCamera={isRequestingCamera}
                  onEnableCamera={getCamera}
                />
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">                <ChatSection
                  socketID={socketID}
                  allMessage={allMessage}
                  targetId={targetId}
                  setTargetId={setTargetId}
                  message={message}
                  setMessage={setMessage}
                  sendMessage={sendMessage}
                  sendOffer={handleSendOffer}
                  currentUserName={currentUserName}
                />
              </div>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">                <div className="text-sm font-medium text-gray-600">Next meetings</div>
                <div className="mt-2 text-lg font-bold text-gray-900">9:10 - 10:40 am</div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="text-sm font-medium text-gray-600">AI assistant</div>
                <div className="mt-2 text-lg font-bold text-gray-900">Ready</div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="text-sm font-medium text-gray-600">Whiteboard</div>
                <div className="mt-2 text-lg font-bold text-gray-900">Live</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App

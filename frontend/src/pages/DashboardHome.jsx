import { Copy, Sparkles, Video } from "lucide-react"
import ChatSection from "../components/ChatSection"
import VideoSection from "../components/VideoSection"
import useCamera from "../hooks/useCamera"
import useChat from "../hooks/useChat"
import useSocket from "../hooks/useSocket"
import useWebRTC from "../hooks/useWebRTC"

function DashboardHome() {
  const currentUserName = localStorage.getItem("userName") || "You"
  const { socketID, socket } = useSocket()
  const {
    targetId,
    setTargetId,
    message,
    setMessage,
    allMessage,
    sendMessage,
  } = useChat(socket, currentUserName)
  const {
    localVideoStream,
    localVideoRef,
    getCamera,
    cameraError,
    isRequestingCamera,
  } = useCamera()
  const { remoteVideoRef, sendOffer } = useWebRTC(
    socket,
    localVideoStream,
    getCamera
  )

  const handleSendOffer = () => {
    if (targetId) {
      sendOffer(targetId)
      return
    }

    alert("Please enter target ID first")
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(18rem,0.8fr)]">
        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_45%,#38bdf8_100%)] p-6 text-white shadow-xl shadow-blue-200/80 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-blue-50 backdrop-blur">
                <Sparkles size={14} />
                Live collaboration
              </div>
              <h3 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
                Video call dashboard with built-in peer chat
              </h3>
              <p className="mt-4 max-w-xl text-sm leading-6 text-blue-50/90 sm:text-base">
                Share your peer ID, connect instantly, and switch to the SMS tool
                from the sidebar whenever you need delivery updates.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/15 bg-white/10 p-5 backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-100">
                Peer ID
              </p>
              <p className="mt-3 max-w-xs break-all font-mono text-sm">
                {socketID || "Connecting..."}
              </p>
              {socketID && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(socketID)
                    alert("Peer ID copied to clipboard!")
                  }}
                  className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-blue-50"
                >
                  <Copy size={16} />
                  Copy My ID
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Video size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Session
              </p>
              <h3 className="text-lg font-semibold text-slate-900">
                Design Meeting
              </h3>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Current user
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {currentUserName}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Camera
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {localVideoStream ? "Enabled" : "Waiting"}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Peer status
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {targetId ? "Ready to connect" : "No peer selected"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(22rem,0.95fr)]">
        <VideoSection
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
          localVideoStream={localVideoStream}
          cameraError={cameraError}
          isRequestingCamera={isRequestingCamera}
          onEnableCamera={getCamera}
        />

        <ChatSection
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
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            Next meeting
          </p>
          <p className="mt-3 text-2xl font-bold text-slate-900">9:10 - 10:40 am</p>
          <p className="mt-2 text-sm text-slate-500">
            Keep your room ready for the next sync.
          </p>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            AI assistant
          </p>
          <p className="mt-3 text-2xl font-bold text-slate-900">Ready</p>
          <p className="mt-2 text-sm text-slate-500">
            Switch sections anytime without leaving the workspace.
          </p>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            Whiteboard
          </p>
          <p className="mt-3 text-2xl font-bold text-slate-900">Live</p>
          <p className="mt-2 text-sm text-slate-500">
            Use chat and video together for quicker reviews.
          </p>
        </div>
      </section>
    </div>
  )
}

export default DashboardHome

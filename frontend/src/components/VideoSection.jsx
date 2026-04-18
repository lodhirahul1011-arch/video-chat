import LocalVideo from "./LocalVideo"
import RemoteVideo from "./RemoteVideo"

function VideoSection({
  localVideoRef,
  remoteVideoRef,
  localVideoStream,
  cameraError,
  isRequestingCamera,
  onEnableCamera,
}) {
  return (
    <div className="relative flex h-full min-h-[26rem] flex-col overflow-hidden rounded-[32px] bg-slate-950">
      <div className="relative flex-1">
        <RemoteVideo remoteVideoRef={remoteVideoRef} />
        <LocalVideo localVideoRef={localVideoRef} />

        {!localVideoStream && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/55 p-6 backdrop-blur-sm">
            <div className="max-w-md rounded-[28px] border border-white/10 bg-white/10 p-8 text-center text-white shadow-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
                Camera
              </p>
              <h3 className="mt-3 text-2xl font-semibold">Camera is off</h3>
              <p className="mt-3 text-sm leading-6 text-slate-200">
                Enable camera to preview your stream and begin video calling.
              </p>

              <button
                onClick={onEnableCamera}
                disabled={isRequestingCamera}
                className="mt-6 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isRequestingCamera ? "Requesting access..." : "Enable Camera"}
              </button>

              {cameraError && (
                <p className="mt-4 text-sm text-red-200">{cameraError}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoSection

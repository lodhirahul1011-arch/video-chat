function RemoteVideo({ remoteVideoRef }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[radial-gradient(circle_at_top,#1e293b_0%,#020617_60%,#000000_100%)]">
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-center backdrop-blur-sm">
          <p className="text-base font-semibold text-white">Waiting for peer...</p>
          <p className="mt-1 text-sm text-slate-300">
            Share your peer ID and connect to start the call.
          </p>
        </div>
      </div>
    </div>
  )
}

export default RemoteVideo

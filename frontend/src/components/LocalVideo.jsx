function LocalVideo({ localVideoRef }) {
  return (
    <div className="absolute bottom-4 right-4 z-10 h-28 w-40 overflow-hidden rounded-2xl border border-white/20 bg-slate-950 shadow-2xl shadow-black/30">
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        className="h-full w-full object-cover"
      />
      <div className="absolute left-2 top-2 rounded-full bg-slate-950/70 px-2 py-1 text-[11px] font-semibold text-white">
        You
      </div>
    </div>
  )
}

export default LocalVideo

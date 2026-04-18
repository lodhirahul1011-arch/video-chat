import { Check, Copy } from "lucide-react"
import { useState } from "react"

function ChatHeader({ socketID, currentUserName }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!socketID) {
      return
    }

    await navigator.clipboard.writeText(socketID)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="border-b border-slate-200 bg-white px-5 py-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Chat Console
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">
            {currentUserName || "You"}
          </h3>
        </div>

        {socketID && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy ID"}
          </button>
        )}
      </div>

      <div className="mt-4 rounded-2xl bg-slate-900 px-4 py-3 text-slate-100">
        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
          Your Peer ID
        </p>
        <p className="mt-2 break-all font-mono text-sm">
          {socketID || "Connecting..."}
        </p>
      </div>
    </div>
  )
}

export default ChatHeader

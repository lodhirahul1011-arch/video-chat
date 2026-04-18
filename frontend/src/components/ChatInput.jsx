import { Radio, Send } from "lucide-react"

function ChatInput({
  targetId,
  setTargetId,
  message,
  setMessage,
  sendMessage,
  sendOffer,
}) {
  return (
    <div className="space-y-3 border-t border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Enter peer ID..."
          value={targetId}
          onChange={(event) => setTargetId(event.target.value)}
          className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
        />
        <button
          onClick={sendOffer}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Radio size={16} />
          Connect
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              sendMessage()
            }
          }}
        />
        <button
          onClick={sendMessage}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:brightness-105"
        >
          <Send size={16} />
          Send
        </button>
      </div>
    </div>
  )
}

export default ChatInput

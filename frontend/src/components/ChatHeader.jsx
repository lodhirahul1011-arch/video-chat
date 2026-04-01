import React from 'react'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

function ChatHeader({socketID}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (socketID) {
      navigator.clipboard.writeText(socketID)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 flex items-center justify-between">
      <div className="flex-1">
        <div className="text-xs font-semibold opacity-90">Your Peer ID</div>
        {socketID ? (
          <div className="font-mono text-sm font-bold mt-1.5 break-all bg-white/20 px-3 py-2 rounded-lg mt-2">
            {socketID}
          </div>
        ) : (
          <div className="text-sm opacity-75 mt-1.5 italic">Generating your Peer ID...</div>
        )}
      </div>
      {socketID && (
        <button
          onClick={handleCopy}
          className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200 flex-shrink-0 ml-2"
          title="Copy ID"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
        </button>
      )}
    </div>
  )
}

export default ChatHeader
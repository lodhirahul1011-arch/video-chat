import React from 'react'
import { Send, Network } from 'lucide-react'

function ChatInput({targetId,setTargetId,message,setMessage,sendMessage,sendOffer}) {
    return (
        <div className="p-4 bg-white border-t border-gray-200 rounded-b-2xl shadow-inner">
            <div className="flex items-center gap-2 mb-3">
                <input
                    type="text"
                    placeholder="Enter peer ID..."
                    value={targetId}
                    onChange={(e) => setTargetId(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
                />
                <button
                    onClick={sendOffer}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                >
                    Connect
                </button>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                />
                <button
                    onClick={sendMessage}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:shadow-xl transition flex items-center gap-2"
                >
                    <Send size={16} /> Send
                </button>
            </div>
        </div>
    )
}

export default ChatInput
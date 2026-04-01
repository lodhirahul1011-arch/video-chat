import React, { useEffect, useRef, useMemo } from 'react'

function ChatArea({allMessage, currentUserName}) {
  const listRef = useRef(null)

  useEffect(() => {
    const el = listRef.current
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }, [allMessage])

  const nameMapping = useMemo(() => {
    const map = {}
    let nextId = 1
    if (allMessage) {
      allMessage.forEach((msg) => {
        if (msg.isOwn) return
        const senderKey = msg.receiverData?.sender || msg.receiverData?.senderId || msg.senderName || `bot-${nextId}`
        if (!map[senderKey]) {
          map[senderKey] = msg.receiverData?.senderName || msg.receiverData?.sender || `User ${nextId}`
          nextId += 1
        }
      })
    }
    return map
  }, [allMessage])

  return (
    <div ref={listRef} className="flex-1 overflow-y-auto p-2 bg-[#E5E5EA] max-h-[calc(100vh-300px)]">
      {allMessage && allMessage.length > 0 ? (
        allMessage.map((msg, index) => (
          <div key={index} className={`mb-1 flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-3 py-2.5 relative ${msg.isOwn ? 'bg-[#0084ff] text-white rounded-bl-2xl rounded-tl-2xl rounded-tr-2xl' : 'bg-white text-gray-800 rounded-br-2xl rounded-tr-2xl rounded-tl-2xl border border-gray-200'}`}>
              <div className="text-[0.68rem] font-semibold mb-1 opacity-80">
              {msg.isOwn ? (currentUserName || 'You') : (nameMapping[msg.receiverData?.sender || msg.receiverData?.senderId || msg.senderName] || msg.receiverData?.sender || msg.receiverData?.senderName || 'User')}
            </div>
              <div className="text-sm leading-5 break-words">{msg.message || msg.receiverData?.message}</div>
              <div className={`absolute text-[0.6rem] ${msg.isOwn ? 'bottom-[-14px] right-0 text-white/70' : 'bottom-[-14px] left-0 text-gray-500'}`}>{msg.time || 'now'}</div>
            </div>
          </div>
        ))
      ) : (
        <div className="h-full flex items-center justify-center text-gray-500">
          <p>No messages yet. Send the first message!</p>
        </div>
      )}
    </div>
  )
}

export default ChatArea
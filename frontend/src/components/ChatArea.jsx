import { useEffect, useMemo, useRef } from "react"

function ChatArea({ allMessage, currentUserName }) {
  const listRef = useRef(null)

  useEffect(() => {
    const element = listRef.current

    if (element) {
      element.scrollTop = element.scrollHeight
    }
  }, [allMessage])

  const nameMapping = useMemo(() => {
    const map = {}
    let nextId = 1

    if (allMessage) {
      allMessage.forEach((msg) => {
        if (msg.isOwn) {
          return
        }

        const senderKey =
          msg.receiverData?.sender ||
          msg.receiverData?.senderId ||
          msg.senderName ||
          `peer-${nextId}`

        if (!map[senderKey]) {
          map[senderKey] =
            msg.receiverData?.senderName ||
            msg.receiverData?.sender ||
            `User ${nextId}`
          nextId += 1
        }
      })
    }

    return map
  }, [allMessage])

  return (
    <div
      ref={listRef}
      className="flex-1 space-y-3 overflow-y-auto bg-[linear-gradient(180deg,#f9fbff_0%,#eef3ff_100%)] p-4"
    >
      {allMessage && allMessage.length > 0 ? (
        allMessage.map((msg, index) => {
          const senderKey =
            msg.receiverData?.sender ||
            msg.receiverData?.senderId ||
            msg.senderName

          return (
            <div
              key={`${senderKey || "self"}-${index}`}
              className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-3xl px-4 py-3 shadow-sm ${
                  msg.isOwn
                    ? "rounded-br-md bg-gradient-to-r from-blue-600 to-indigo-500 text-white"
                    : "rounded-bl-md border border-slate-200 bg-white text-slate-800"
                }`}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-75">
                  {msg.isOwn
                    ? currentUserName || "You"
                    : nameMapping[senderKey] ||
                      msg.receiverData?.senderName ||
                      msg.receiverData?.sender ||
                      "User"}
                </p>
                <p className="mt-1 text-sm leading-6 break-words">
                  {msg.message || msg.receiverData?.message}
                </p>
                <p
                  className={`mt-2 text-[11px] ${
                    msg.isOwn ? "text-blue-100" : "text-slate-400"
                  }`}
                >
                  {msg.time || "now"}
                </p>
              </div>
            </div>
          )
        })
      ) : (
        <div className="flex h-full min-h-52 items-center justify-center">
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white/80 px-6 py-8 text-center">
            <p className="text-base font-semibold text-slate-700">No messages yet</p>
            <p className="mt-1 text-sm text-slate-400">
              Peer ID connect karo aur pehla message bhejo.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatArea

import ChatArea from "./ChatArea"
import ChatHeader from "./ChatHeader"
import ChatInput from "./ChatInput"

function ChatSection({
  socketID,
  allMessage,
  targetId,
  setTargetId,
  message,
  setMessage,
  sendMessage,
  sendOffer,
  currentUserName,
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm shadow-slate-200/70">
      <ChatHeader socketID={socketID} currentUserName={currentUserName} />
      <ChatArea allMessage={allMessage} currentUserName={currentUserName} />
      <ChatInput
        targetId={targetId}
        setTargetId={setTargetId}
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
        sendOffer={sendOffer}
      />
    </div>
  )
}

export default ChatSection

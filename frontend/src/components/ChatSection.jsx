import React from 'react'
import ChatInput from './ChatInput'
import ChatArea from './ChatArea'
import ChatHeader from './ChatHeader'

const ChatSection = ({socketID,allMessage,targetId,setTargetId,message,setMessage,sendMessage,sendOffer,currentUserName}) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
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
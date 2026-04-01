import { useState, useEffect } from "react"
import { io } from "socket.io-client"

let socketInstance = null
let activeSocketUrl = ""

const socketUrls = (() => {
  const configuredUrl = import.meta.env.VITE_SOCKET_URL?.trim()
  const origin = window.location.origin

  return [
    configuredUrl,
    "http://localhost:9000",
    "http://localhost:9001",
    origin,
  ].filter((value, index, list) => value && list.indexOf(value) === index)
})()

const createSocket = (url) => io(url, {
  transports: ["websocket", "polling"],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: socketUrls.length,
  timeout: 5000,
})

const getSocketInstance = () => {
  if (!socketInstance) {
    activeSocketUrl = socketUrls[0]
    socketInstance = createSocket(activeSocketUrl)
  }

  return socketInstance
}

const reconnectToNextUrl = () => {
  if (!socketInstance) {
    return
  }

  const currentIndex = socketUrls.indexOf(activeSocketUrl)
  const nextUrl = socketUrls[currentIndex + 1]

  if (!nextUrl) {
    return
  }

  console.warn(`Socket connection failed on ${activeSocketUrl}, retrying on ${nextUrl}`)
  socketInstance.disconnect()
  socketInstance.io.uri = nextUrl
  activeSocketUrl = nextUrl
  socketInstance.connect()
}

const useSocket = () => {
  const [socketID, setSocketID] = useState("")
  const socket = getSocketInstance()
  
  useEffect(() => {
    const handleConnect = () => {
      console.log("Connected to server:", activeSocketUrl)
      console.log("My socket ID:", socket.id)
      setSocketID(socket.id)
    }

    const handleDisconnect = () => {
      setSocketID("")
    }

    const handleConnectError = (error) => {
      console.error(`Socket connect error on ${activeSocketUrl}:`, error.message)
      reconnectToNextUrl()
    }
    
    socket.on("connect", handleConnect)
    socket.on("disconnect", handleDisconnect)
    socket.on("connect_error", handleConnectError)
    
    return () => {
      socket.off("connect", handleConnect)
      socket.off("disconnect", handleDisconnect)
      socket.off("connect_error", handleConnectError)
    }
  }, [socket])
  
  return { socketID, socket }
}

export default useSocket

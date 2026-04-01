import { useState, useRef } from "react"

const useCamera = () => {
  const [localVideoStream, setLocalVideoStream] = useState(null)
  const [cameraError, setCameraError] = useState("")
  const [isRequestingCamera, setIsRequestingCamera] = useState(false)
  const localVideoRef = useRef(null)
  
  // Camera access karne ka function
  const getCamera = async () => {
    // Agar stream already hai toh return karo
    if (localVideoStream) {
      console.log("Camera already active")
      return localVideoStream
    }
    
    try {
      setCameraError("")
      setIsRequestingCamera(true)
      console.log("Requesting camera access...")

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera API is not available in this browser")
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      })
      
      console.log("Camera access granted")
      
      // Video element me stream set karo
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
        await localVideoRef.current.play().catch(() => {})
      }
      
      // State update karo
      setLocalVideoStream(stream)
      
      return stream
    } catch (error) {
      console.error("Camera access denied:", error)
      const messageMap = {
        NotAllowedError: "Camera permission denied. Browser settings me camera allow karo.",
        NotFoundError: "Camera device nahi mila. Camera connect karke try karo.",
        NotReadableError: "Camera kisi aur app me busy hai. Dusri app band karke try karo.",
        OverconstrainedError: "Requested camera settings supported nahi hain.",
      }
      const nextError = messageMap[error.name] || error.message || "Camera access failed"
      setCameraError(nextError)
      throw error
    } finally {
      setIsRequestingCamera(false)
    }
  }
  
  // Camera band karne ka function
  const stopCamera = () => {
    if (localVideoStream) {
      console.log("Stopping camera...")
      
      // Sab tracks stop karo (video + audio)
      localVideoStream.getTracks().forEach(track => {
        track.stop()
        console.log(`Stopped track: ${track.kind}`)
      })
      
      // State clear karo
      setLocalVideoStream(null)
      setCameraError("")
      
      // Video element clear karo
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null
      }
    }
  }
  
  return { 
    localVideoStream, 
    localVideoRef, 
    getCamera, 
    stopCamera,
    cameraError,
    isRequestingCamera,
  }
}

export default useCamera

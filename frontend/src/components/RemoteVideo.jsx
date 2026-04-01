import React from 'react'

const RemoteVideo = ({remoteVideoRef}) => {
    return (
        <div className="w-full h-full bg-black rounded-lg overflow-hidden flex items-center justify-center">
            <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute text-gray-400 text-center pointer-events-none">
                <p className="text-lg font-medium">Waiting for peer...</p>
            </div>
        </div>
    )
}

export default RemoteVideo
import React from 'react'

const LocalVideo = ({localVideoRef}) => {
    return (
        <div className="absolute bottom-4 right-4 w-32 h-24 bg-black rounded-lg overflow-hidden border-2 border-white/30 shadow-lg z-10 hover:border-purple-500 transition-all">
            <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <div className="absolute top-2 left-2 text-xs font-bold text-white bg-black/50 px-2 py-1 rounded">You</div>
        </div>
    )
}

export default LocalVideo
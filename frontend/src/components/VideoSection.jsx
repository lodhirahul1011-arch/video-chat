import React from 'react'
import LocalVideo from './LocalVideo'
import RemoteVideo from './RemoteVideo'

const VideoSection = ({
  localVideoRef,
  remoteVideoRef,
  localVideoStream,
  cameraError,
  isRequestingCamera,
  onEnableCamera,
}) => {
  return (
    <div className="h-full flex flex-col bg-gray-900 rounded-2xl overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center">
        <RemoteVideo remoteVideoRef={remoteVideoRef}/>
        <LocalVideo localVideoRef={localVideoRef}/>

        {!localVideoStream && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20">
            <div className="max-w-sm text-center px-6">
              <div className="text-white text-lg font-semibold">Camera is off</div>
              <div className="text-gray-300 text-sm mt-2">
                Enable camera to show your local preview and start video calling.
              </div>
              <button
                onClick={onEnableCamera}
                disabled={isRequestingCamera}
                className="mt-5 px-5 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {isRequestingCamera ? "Requesting access..." : "Enable Camera"}
              </button>
              {cameraError && (
                <div className="mt-3 text-sm text-red-300">{cameraError}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoSection

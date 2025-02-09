import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Hls from "hls.js";

function MoviePlayer() {
  const videoRef = useRef(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const streamUrl = searchParams.get("url"); // Get the video URL from query params

  useEffect(() => {
    if (Hls.isSupported() && streamUrl) {
      const hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(videoRef.current);
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = streamUrl;
    }
  }, [streamUrl]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="relative w-[80%] h-[60vh] bg-gray-900 p-4 rounded-lg">
        <h2 className="text-white text-xl mb-4 text-center">Now Playing</h2>
        <video ref={videoRef} controls className="w-full h-full rounded-lg"></video>
      </div>
    </div>
  );
}

export default MoviePlayer;

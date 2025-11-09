
import React, { useEffect, forwardRef } from 'react';

interface VideoFeedProps {
  onReady: () => void;
}

const VideoFeed = forwardRef<HTMLVideoElement, VideoFeedProps>(({ onReady }, ref) => {
  useEffect(() => {
    let stream: MediaStream | null = null;
    const videoElement = (ref as React.RefObject<HTMLVideoElement>)?.current;
    
    const startCamera = async () => {
      if (!videoElement) return;

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false,
        });
        videoElement.srcObject = stream;
        videoElement.onloadedmetadata = () => {
          onReady();
        };
      } catch (err) {
        console.error("Error accessing camera: ", err);
        // Handle error (e.g., show a message to the user)
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [ref, onReady]);

  return (
    <video
      ref={ref}
      autoPlay
      playsInline
      muted
      className="w-full h-full object-cover"
    />
  );
});

VideoFeed.displayName = 'VideoFeed';

export default VideoFeed;

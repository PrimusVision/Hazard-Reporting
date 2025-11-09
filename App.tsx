
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { analyzeImageForHazards } from './services/geminiService';
import { type Hazard } from './types';
import Header from './components/Header';
import VideoFeed from './components/VideoFeed';
import HazardList from './components/HazardList';
import ScanControls from './components/ScanControls';
import StatusOverlay from './components/StatusOverlay';

const SCAN_INTERVAL_MS = 4000; // Scan every 4 seconds

export default function App(): React.ReactElement {
  const [isCameraReady, setIsCameraReady] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hazards, setHazards] = useState<Hazard[]>([]);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanIntervalRef = useRef<number | null>(null);

  const captureFrameAsBase64 = useCallback((): string | null => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        // The part after the comma is the base64 data
        return canvas.toDataURL('image/jpeg').split(',')[1];
      }
    }
    return null;
  }, []);

  const performScan = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);
    const base64Image = captureFrameAsBase64();

    if (base64Image) {
      try {
        const detectedHazards = await analyzeImageForHazards(base64Image);
        setHazards(detectedHazards);
      } catch (err) {
        console.error('Error analyzing image:', err);
        setError('Failed to analyze the video feed. Please try again.');
        setHazards([]);
      }
    } else {
        setError('Could not capture a frame from the video feed.');
    }
    setIsLoading(false);
  }, [captureFrameAsBase64, isLoading]);
  
  const handleToggleScan = () => {
    setIsScanning(prev => !prev);
  };
  
  useEffect(() => {
    if (isScanning && isCameraReady) {
        // Perform an initial scan immediately
        performScan();
        scanIntervalRef.current = window.setInterval(performScan, SCAN_INTERVAL_MS);
    } else {
        if (scanIntervalRef.current) {
            clearInterval(scanIntervalRef.current);
            scanIntervalRef.current = null;
        }
    }

    return () => {
        if (scanIntervalRef.current) {
            clearInterval(scanIntervalRef.current);
        }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScanning, isCameraReady]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3 flex flex-col gap-4">
          <div className="relative aspect-video bg-black rounded-lg shadow-2xl overflow-hidden border-2 border-gray-700">
            <VideoFeed ref={videoRef} onReady={() => setIsCameraReady(true)} />
            <StatusOverlay isCameraReady={isCameraReady} isLoading={isLoading} isScanning={isScanning} error={error} />
          </div>
          <ScanControls 
            isScanning={isScanning} 
            onToggleScan={handleToggleScan} 
            isCameraReady={isCameraReady}
            isLoading={isLoading}
          />
        </div>
        <div className="lg:w-1/3">
          <HazardList hazards={hazards} isLoading={isLoading} isScanning={isScanning} />
        </div>
      </main>
      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
}

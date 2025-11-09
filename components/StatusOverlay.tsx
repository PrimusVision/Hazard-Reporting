
import React from 'react';
import Spinner from './Spinner';

interface StatusOverlayProps {
  isCameraReady: boolean;
  isLoading: boolean;
  isScanning: boolean;
  error: string | null;
}

export default function StatusOverlay({ isCameraReady, isLoading, isScanning, error }: StatusOverlayProps): React.ReactElement | null {
  const showOverlay = !isCameraReady || error || (isScanning && isLoading);

  if (!showOverlay) {
    return null;
  }

  const getStatusContent = () => {
    if (!isCameraReady) {
      return (
        <>
          <Spinner />
          <p>Initializing camera...</p>
        </>
      );
    }
    if (error) {
      return (
        <>
          <div className="text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-lg text-red-300">{error}</p>
        </>
      );
    }
    if (isScanning && isLoading) {
      return (
        <>
          <Spinner />
          <p>Analyzing frame...</p>
        </>
      );
    }
    return null;
  };

  return (
    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-4 text-white font-semibold z-10">
      {getStatusContent()}
    </div>
  );
}

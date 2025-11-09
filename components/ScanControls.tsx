
import React from 'react';
import Spinner from './Spinner';

interface ScanControlsProps {
    isScanning: boolean;
    onToggleScan: () => void;
    isCameraReady: boolean;
    isLoading: boolean;
}

const ScanIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const StopIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 10h6v4H9z" />
    </svg>
);

export default function ScanControls({ isScanning, onToggleScan, isCameraReady, isLoading }: ScanControlsProps): React.ReactElement {
    const buttonText = isScanning ? 'Stop Scanning' : 'Start Scanning';
    const Icon = isScanning ? StopIcon : ScanIcon;
    const buttonBg = isScanning ? 'bg-red-600 hover:bg-red-700' : 'bg-cyan-600 hover:bg-cyan-700';

    return (
        <div className="bg-gray-800/50 p-4 rounded-lg flex items-center justify-between border border-gray-700 shadow-lg">
            <div className="flex items-center gap-3">
                {isLoading && isScanning ? (
                    <>
                        <Spinner />
                        <span className="text-gray-300 font-medium">Analyzing...</span>
                    </>
                ) : (
                    <span className={`h-4 w-4 rounded-full ${isScanning ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></span>
                )}
                <span className="font-semibold text-lg">{isScanning ? 'SCAN ACTIVE' : 'SCAN INACTIVE'}</span>
            </div>

            <button
                onClick={onToggleScan}
                disabled={!isCameraReady || (isLoading && !isScanning)}
                className={`px-6 py-3 text-white font-bold rounded-lg shadow-md flex items-center gap-2 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                    !isCameraReady 
                        ? 'bg-gray-600 cursor-not-allowed' 
                        : buttonBg
                }`}
            >
                <Icon />
                {buttonText}
            </button>
        </div>
    );
}

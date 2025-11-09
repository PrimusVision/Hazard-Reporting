
import React from 'react';
import { type Hazard, HazardSeverity, HazardType } from '../types';

const severityConfig = {
  [HazardSeverity.High]: {
    bgColor: 'bg-red-900/50',
    borderColor: 'border-red-500',
    textColor: 'text-red-300',
    icon: '🔥',
    label: 'High'
  },
  [HazardSeverity.Medium]: {
    bgColor: 'bg-yellow-900/50',
    borderColor: 'border-yellow-500',
    textColor: 'text-yellow-300',
    icon: '⚠️',
    label: 'Medium'
  },
  [HazardSeverity.Low]: {
    bgColor: 'bg-blue-900/50',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-300',
    icon: '➡️',
    label: 'Low'
  },
};

const HazardCard: React.FC<{ hazard: Hazard }> = ({ hazard }) => {
  const config = severityConfig[hazard.severity];
  const isUnsafeAct = hazard.type === HazardType.UnsafeAct;

  return (
    <div className={`p-4 rounded-lg border ${config.borderColor} ${config.bgColor} flex items-start gap-4 transition-all duration-300`}>
      <div className="text-2xl pt-1">{config.icon}</div>
      <div>
        <div className="flex items-center gap-3">
          <span className={`px-2 py-1 text-xs font-bold rounded ${isUnsafeAct ? 'bg-orange-500/80 text-white' : 'bg-indigo-500/80 text-white'}`}>
            {hazard.type}
          </span>
          <span className={`font-semibold text-sm ${config.textColor}`}>
            {config.label} Severity
          </span>
        </div>
        <p className="text-gray-200 mt-2 text-base">{hazard.description}</p>
      </div>
    </div>
  );
};

interface HazardListProps {
  hazards: Hazard[];
  isLoading: boolean;
  isScanning: boolean;
}

export default function HazardList({ hazards, isLoading, isScanning }: HazardListProps): React.ReactElement {
  return (
    <div className="bg-gray-800/50 rounded-lg p-4 h-full flex flex-col border border-gray-700 shadow-xl">
      <h2 className="text-xl font-bold mb-4 text-cyan-300">Detected Hazards</h2>
      <div className="flex-grow overflow-y-auto pr-2 space-y-3">
        {!isScanning && hazards.length === 0 && (
          <div className="h-full flex items-center justify-center text-gray-400">
            <p>Start scanning to detect hazards.</p>
          </div>
        )}
        {isScanning && isLoading && hazards.length === 0 && (
          <div className="h-full flex items-center justify-center text-gray-400">
            <p>Scanning for potential hazards...</p>
          </div>
        )}
        {isScanning && !isLoading && hazards.length === 0 && (
          <div className="h-full flex items-center justify-center text-green-400">
            <p>No hazards detected in the current view.</p>
          </div>
        )}
        {hazards.map((hazard, index) => (
          <HazardCard key={`${hazard.description}-${index}`} hazard={hazard} />
        ))}
      </div>
    </div>
  );
}


import React from 'react';

const ShieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944A12.02 12.02 0 0012 22a12.02 12.02 0 009-1.056c.343-.344.662-.701.948-1.072A11.955 11.955 0 0021 12c0-1.75-.38-3.415-1.055-4.944z" />
    </svg>
);


export default function Header(): React.ReactElement {
  return (
    <header className="bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center gap-4">
        <ShieldIcon />
        <h1 className="text-2xl font-bold tracking-tight text-white">
          AI Safety Hazard Detector
        </h1>
      </div>
    </header>
  );
}

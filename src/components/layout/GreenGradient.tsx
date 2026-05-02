import React, { ReactNode } from 'react';

interface GreenGradientProps {
  children?: ReactNode;
  className?: string;
}

const GreenGradient: React.FC<GreenGradientProps> = ({ children, className = '' }) => {
  return (
    <div className={`w-full min-h-screen bg-gradient-to-b from-[#0A1F13] to-[#166534] ${className}`}>
      {children}
    </div>
  );
};

export default GreenGradient;
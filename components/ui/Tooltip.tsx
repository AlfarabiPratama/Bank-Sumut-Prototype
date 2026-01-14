import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { HelpCircle, Info } from 'lucide-react';

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  showIcon?: boolean;
  iconSize?: number;
  delay?: number;
}

const Tooltip: React.FC<TooltipProps> = ({ 
  children, 
  content, 
  position = 'top',
  showIcon = false,
  iconSize = 14,
  delay = 200
}) => {
  const [visible, setVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState(position);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setVisible(false);
  };

  // Adjust position if tooltip goes off screen
  useEffect(() => {
    if (visible && tooltipRef.current && containerRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      
      // Check if tooltip goes off screen and adjust
      if (position === 'top' && tooltipRect.top < 0) {
        setActualPosition('bottom');
      } else if (position === 'bottom' && tooltipRect.bottom > window.innerHeight) {
        setActualPosition('top');
      } else if (position === 'left' && tooltipRect.left < 0) {
        setActualPosition('right');
      } else if (position === 'right' && tooltipRect.right > window.innerWidth) {
        setActualPosition('left');
      } else {
        setActualPosition(position);
      }
    }
  }, [visible, position]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-900 border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-900 border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-900 border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-gray-900 border-y-transparent border-l-transparent'
  };

  return (
    <div 
      ref={containerRef}
      className="relative inline-flex items-center"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      
      {showIcon && (
        <HelpCircle 
          size={iconSize} 
          className="ml-1 text-gray-400 hover:text-blue-500 cursor-help transition-colors" 
        />
      )}
      
      {visible && (
        <div 
          ref={tooltipRef}
          className={`
            absolute z-50 px-3 py-2 
            bg-gray-900 text-white text-xs rounded-lg
            max-w-xs whitespace-normal
            shadow-lg
            animate-fade-in
            ${positionClasses[actualPosition]}
          `}
          role="tooltip"
        >
          {content}
          {/* Arrow */}
          <div 
            className={`
              absolute w-0 h-0 
              border-4 
              ${arrowClasses[actualPosition]}
            `}
          />
        </div>
      )}
    </div>
  );
};

// Simpler inline tooltip for icons only
interface InfoTooltipProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  size?: number;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ 
  content, 
  position = 'top',
  size = 14 
}) => {
  return (
    <Tooltip content={content} position={position}>
      <Info 
        size={size} 
        className="text-gray-400 hover:text-blue-500 cursor-help transition-colors" 
      />
    </Tooltip>
  );
};

export default Tooltip;

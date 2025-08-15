"use client";

import { useEffect, useRef, useState } from "react";
import type { TeleprompterSettings } from "./TeleprompterApp";

interface TeleprompterDisplayProps {
  script: string;
  settings: TeleprompterSettings;
  resetTrigger?: number;
}

export function TeleprompterDisplay({ script, settings, resetTrigger }: TeleprompterDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isRestarting, setIsRestarting] = useState(false);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!settings.isPlaying || !textRef.current || !containerRef.current) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const animate = () => {
      setScrollPosition(prev => {
        const newPosition = prev + (settings.speed / 10);
        
        if (!textRef.current || !containerRef.current) return newPosition;
        
        // Calculate scroll bounds more accurately
        const containerHeight = containerRef.current.clientHeight;
        const textHeight = textRef.current.scrollHeight;
        
        // The script should restart when all content has scrolled past the top
        // This includes the top spacing (100vh) + script content + some buffer
        const maxScroll = textHeight - containerHeight + (containerHeight * 0.5);
        
        // Smooth restart: Reset to beginning when script completes
        if (newPosition > maxScroll) {
          // Show restart indicator briefly
          setIsRestarting(true);
          setTimeout(() => setIsRestarting(false), 500);
          
          // Reset to start position where script begins to appear from bottom
          return -(containerHeight * 0.5);
        }
        
        return newPosition;
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [settings.isPlaying, settings.speed]);

  // Handle external reset trigger
  useEffect(() => {
    if (resetTrigger && resetTrigger > 0) {
      resetScript();
    }
  }, [resetTrigger]);

  // Manual reset function
  const resetScript = () => {
    if (!containerRef.current) return;
    const containerHeight = containerRef.current.clientHeight;
    setScrollPosition(-(containerHeight * 0.5));
    setIsRestarting(true);
    setTimeout(() => setIsRestarting(false), 500);
  };

  // Handle touch gestures for mobile
  const touchStartRef = useRef<{ y: number; time: number } | null>(null);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      y: e.touches[0].clientY,
      time: Date.now()
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    
    const touchEnd = e.changedTouches[0];
    const deltaY = touchStartRef.current.y - touchEnd.clientY;
    const deltaTime = Date.now() - touchStartRef.current.time;
    
    // Long press to reset script
    if (Math.abs(deltaY) < 10 && deltaTime > 1000) {
      resetScript();
      return;
    }
    
    // Quick tap to toggle play/pause
    if (Math.abs(deltaY) < 10 && deltaTime < 300) {
      // This should be handled by parent component
      return;
    }
    
    // Swipe gestures for manual scroll control
    if (Math.abs(deltaY) > 50 && deltaTime < 500) {
      setScrollPosition(prev => {
        const adjustment = deltaY > 0 ? 100 : -100;
        const newPos = prev + adjustment;
        return Math.max(-(containerRef.current?.clientHeight || 0), newPos);
      });
    }
    
    touchStartRef.current = null;
  };

  const textStyle = {
    fontSize: `${settings.fontSize}px`,
    color: settings.textColor,
    textShadow: settings.hasOutline 
      ? `2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000`
      : 'none',
    transform: settings.isFlipped ? 'scaleX(-1)' : 'none',
    paddingLeft: `${settings.margin}%`,
    paddingRight: `${settings.margin}%`,
    textAlign: settings.textAlign as 'left' | 'center' | 'right',
  };

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 pt-16 overflow-hidden cursor-pointer select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={() => {
        // Click to pause/play
        // This will be handled by parent component
      }}
    >
      <div
        ref={textRef}
        className="whitespace-pre-wrap leading-relaxed font-sans transition-transform duration-75 teleprompter-text"
        style={{
          ...textStyle,
          transform: `translateY(${-scrollPosition}px) ${settings.isFlipped ? 'scaleX(-1)' : ''}`,
        }}
      >
        {/* Add some top spacing */}
        <div style={{ height: '100vh' }} />
        {script}
        {/* Add some bottom spacing */}
        <div style={{ height: '100vh' }} />
      </div>

      {/* Restart indicator */}
      {isRestarting && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white/90 text-black px-6 py-3 rounded-lg text-lg font-medium animate-pulse">
            ↻ Restarting Script...
          </div>
        </div>
      )}
    </div>
  );
}
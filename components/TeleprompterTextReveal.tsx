"use client";

import { motion } from "motion/react";
import { useMemo, useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TeleprompterTextRevealProps {
  children: string;
  scrollPosition: number;
  containerHeight: number;
  fontSize: number;
  className?: string;
  style?: React.CSSProperties;
}

interface WordPosition {
  word: string;
  index: number;
  top: number;
  left: number;
  width: number;
  height: number;
  lineIndex: number;
}

export function TeleprompterTextReveal({ 
  children, 
  scrollPosition, 
  containerHeight, 
  fontSize,
  className,
  style
}: TeleprompterTextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [wordPositions, setWordPositions] = useState<WordPosition[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Split text into words while preserving whitespace structure
  const words = useMemo(() => {
    return children.split(/(\s+)/).filter(word => word.length > 0);
  }, [children]);

  // Measure word positions after render
  useEffect(() => {
    if (!containerRef.current || words.length === 0) return;
    
    const measureWords = () => {
      try {
        const container = containerRef.current;
        if (!container) return;
        
        const wordElements = container.querySelectorAll('[data-word-index]');
        if (wordElements.length === 0) return;
        
        const positions: WordPosition[] = [];
        const containerRect = container.getBoundingClientRect();
        let currentLineTop = -1;
        let lineIndex = 0;
        
        wordElements.forEach((element, index) => {
          const rect = element.getBoundingClientRect();
          const relativeTop = rect.top - containerRect.top;
          
          // Determine if this is a new line
          if (currentLineTop === -1 || Math.abs(relativeTop - currentLineTop) > fontSize * 0.5) {
            currentLineTop = relativeTop;
            lineIndex++;
          }
          
          positions.push({
            word: words[index] || '',
            index,
            top: relativeTop,
            left: rect.left - containerRect.left,
            width: rect.width,
            height: rect.height,
            lineIndex: lineIndex - 1
          });
        });
        
        setWordPositions(positions);
        setIsInitialized(true);
      } catch (error) {
        console.warn('Error measuring word positions:', error);
        setIsInitialized(false);
      }
    };
    
    // Measure after a brief delay to ensure proper rendering
    const timer = setTimeout(measureWords, 150);
    
    return () => {
      clearTimeout(timer);
    };
  }, [words, fontSize, containerHeight]);

  // Calculate word opacity based on visual line position
  const getWordOpacity = (wordPos: WordPosition) => {
    if (!isInitialized || containerHeight === 0) return 0.3;
    
    // Calculate the center of the viewport (reading line)
    const centerY = containerHeight * 0.5;
    
    // Calculate the visual position of this word accounting for scroll
    const wordScreenY = wordPos.top - scrollPosition + (containerHeight * 0.6);
    
    // Calculate distance from center reading line
    const distanceFromCenter = Math.abs(wordScreenY - centerY);
    
    // Define the reveal zones based on actual line height
    const lineHeight = fontSize * 1.5;
    const activeZone = lineHeight * 0.7; // Current line
    const primaryZone = lineHeight * 2; // Adjacent lines
    const secondaryZone = lineHeight * 4; // Extended context
    const fadeZone = lineHeight * 6; // Fade out zone
    
    if (distanceFromCenter < activeZone) {
      return 1; // Fully visible
    } else if (distanceFromCenter < primaryZone) {
      return 0.85; // High visibility
    } else if (distanceFromCenter < secondaryZone) {
      return 0.6; // Medium visibility
    } else if (distanceFromCenter < fadeZone) {
      const fadeProgress = (distanceFromCenter - secondaryZone) / (fadeZone - secondaryZone);
      return 0.6 - (fadeProgress * 0.45); // Fade from 0.6 to 0.15
    } else {
      return 0.15; // Very dim
    }
  };

  // Get scale for active words
  const getWordScale = (wordPos: WordPosition) => {
    if (!isInitialized || containerHeight === 0) return 1;
    
    const centerY = containerHeight * 0.5;
    const wordScreenY = wordPos.top - scrollPosition + (containerHeight * 0.6);
    const distanceFromCenter = Math.abs(wordScreenY - centerY);
    const activeZone = fontSize * 1.05; // Slightly larger than line height
    
    return distanceFromCenter < activeZone ? 1.02 : 1;
  };

  // Get glow effect for active words
  const getWordGlow = (wordPos: WordPosition) => {
    if (!isInitialized || containerHeight === 0) return 'inherit';
    
    const centerY = containerHeight * 0.5;
    const wordScreenY = wordPos.top - scrollPosition + (containerHeight * 0.6);
    const distanceFromCenter = Math.abs(wordScreenY - centerY);
    const activeZone = fontSize * 1.05;
    
    if (distanceFromCenter < activeZone) {
      return '0 0 15px rgba(59, 130, 246, 0.4), 0 0 30px rgba(59, 130, 246, 0.2)';
    }
    return 'inherit';
  };

  return (
    <div 
      ref={containerRef}
      className={cn("whitespace-pre-wrap leading-relaxed font-sans", className)}
      style={style}
    >
      {words.map((word, index) => {
        const wordPos = wordPositions.find(pos => pos.index === index);
        const opacity = Math.max(0.1, Math.min(1, wordPos ? getWordOpacity(wordPos) : 0.3));
        const scale = Math.max(0.9, Math.min(1.1, wordPos ? getWordScale(wordPos) : 1));
        const textShadow = wordPos ? getWordGlow(wordPos) : 'inherit';
        
        return (
          <motion.span
            key={`word-${index}`}
            data-word-index={index}
            className="inline-block"
            animate={{ 
              opacity: isFinite(opacity) ? opacity : 0.3,
              scale: isFinite(scale) ? scale : 1,
            }}
            transition={{ 
              duration: 0.3,
              ease: "easeOut"
            }}
            style={{
              textShadow: textShadow,
              transformOrigin: 'center',
            }}
          >
            {word}
          </motion.span>
        );
      })}
    </div>
  );
}
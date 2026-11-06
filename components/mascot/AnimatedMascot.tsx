'use client';

import React, { useState, useEffect } from 'react';

interface AnimatedMascotProps {
  className?: string;
  size?: number;
  scrollY?: number; // for scroll-driven scrollytelling parallax
}

export default function AnimatedMascot({
  className = '',
  size = 460,
  scrollY = 0,
}: AnimatedMascotProps) {
  const [isBlinking, setIsBlinking] = useState(false);

  // Natural blink loop: blinks every 3.5 to 5.5 seconds
  useEffect(() => {
    let blinkTimeout: NodeJS.Timeout;
    const scheduleNextBlink = () => {
      const delay = 3500 + Math.random() * 2000;
      blinkTimeout = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleNextBlink();
        }, 160);
      }, delay);
    };

    scheduleNextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  // Parallax scroll factor: as user scrolls down, mascot gains extra vertical float and gentle tilt
  const scrollOffset = Math.min(scrollY * 0.35, 180);
  const scrollScale = Math.max(0.85, 1 - scrollY * 0.0006);

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      style={{
        transform: `translate3d(0, ${scrollOffset}px, 0) scale(${scrollScale})`,
        transition: 'transform 0.1s cubic-bezier(0,0,0.2,1)',
      }}
    >
      {/* Immersive Mascot Character Stage with Spring Jump Loop */}
      <div className="relative group cursor-pointer">
        {/* Soft atmospheric backlight against pure black */}
        <div
          className="absolute inset-0 rounded-full blur-[80px] opacity-35 bg-gradient-to-b from-[#FF5A1F]/30 via-transparent to-transparent pointer-events-none"
          style={{ transform: 'scale(1.2)' }}
        />

        {/* Mascot Character with Jump Animation */}
        <div className="relative z-10 animate-mascot-jump-smooth">
          <img
            src="/logo.png"
            alt="Fit&Flash Mascot"
            style={{ width: size, height: size }}
            className="object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.9)] max-w-full h-auto"
            draggable={false}
          />

          {/* Natural Blink Overlay */}
          {isBlinking && (
            <div
              className="absolute pointer-events-none flex items-center justify-between"
              style={{
                top: `${size * 0.285}px`,
                left: `${size * 0.40}px`,
                width: `${size * 0.22}px`,
              }}
            >
              <div className="w-3 h-1 bg-[#0c0c12] rounded-full" />
              <div className="w-3 h-1 bg-[#0c0c12] rounded-full" />
            </div>
          )}
        </div>

        {/* Dynamic Contact Shadow on 3D Grid Floor with subtle orange rim glow */}
        <div className="relative mx-auto -mt-2 flex items-center justify-center pointer-events-none">
          <div
            className="w-48 h-3.5 rounded-full blur-sm animate-mascot-shadow-jump"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.92)',
              boxShadow: '0 0 18px 4px rgba(255, 122, 26, 0.38), 0 0 32px 6px rgba(26, 163, 255, 0.20)',
            }}
          />
        </div>
      </div>
    </div>
  );
}

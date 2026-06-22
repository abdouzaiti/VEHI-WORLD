import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface MotionIntroProps {
  onComplete: () => void;
}

export default function MotionIntro({ onComplete }: MotionIntroProps) {
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(true);

  // Auto-progress animation
  useEffect(() => {
    const duration = 2800; // 2.8 seconds total intro
    const intervalTime = 30;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const nextProgress = Math.min((currentStep / steps) * 100, 100);
      setProgress(nextProgress);

      if (nextProgress >= 100) {
        clearInterval(timer);
        // Add a slight delay before triggering transition out
        setTimeout(() => {
          setShowContent(false);
        }, 300);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // Handle the exit animation complete to notify parent
  const handleExitComplete = () => {
    onComplete();
  };

  const titleWords = "VEHI WORLD".split("");

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {showContent && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.05,
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center overflow-hidden"
          id="motion-intro-overlay"
        >
          {/* Ambient background glows - French Tricolor abstract layout */}
          <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
            {/* Blue Glow left-top */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 0.3 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute -top-1/4 -left-1/4 w-[70vw] h-[70vw] rounded-full bg-blue-700/30 blur-[130px]"
            />
            {/* White/Silver Center flash */}
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.15 }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] rounded-full bg-white/20 blur-[100px]"
            />
            {/* Red Glow right-bottom */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 0.3 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute -bottom-1/4 -right-1/4 w-[70vw] h-[70vw] rounded-full bg-[#C8102E]/30 blur-[130px]"
            />
          </div>

          {/* Speed-line elements animating in the background to evoke motion */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: Math.random() * window.innerWidth, 
                  y: Math.random() * window.innerHeight, 
                  width: Math.random() * 80 + 20, 
                  height: 1, 
                  opacity: 0 
                }}
                animate={{ 
                  x: [null, Math.random() * window.innerWidth - 200],
                  opacity: [0, Math.random() * 0.3 + 0.1, 0] 
                }}
                transition={{ 
                  duration: Math.random() * 1.5 + 1, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                className={`absolute bg-gradient-to-r ${
                  i % 3 === 0 
                    ? "from-blue-500/0 via-blue-500 to-blue-500/0" 
                    : i % 3 === 1 
                    ? "from-white/0 via-white to-white/0" 
                    : "from-red-500/0 via-red-500 to-red-500/0"
                }`}
              />
            ))}
          </div>



          {/* Main Cinematic Card Container */}
          <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center space-y-8">
            
            {/* Animated Brand Logo element */}
            <div className="relative flex items-center justify-center">
              {/* Backlight halo rotate */}
              <motion.div
                initial={{ rotate: 0, opacity: 0 }}
                animate={{ rotate: 360, opacity: 1 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="absolute w-44 h-44 rounded-full border border-dashed border-white/10"
              />
              
              {/* Logo wrap with dynamic hover scale and shadow */}
              <motion.div
                initial={{ scale: 0.3, opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ scale: 1, opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ 
                  duration: 1.2, 
                  ease: [0.34, 1.56, 0.64, 1] // Custom bouncy elastic curve
                }}
                className="relative bg-slate-950/60 p-4 border border-white/5 rounded-full shadow-2xl backdrop-blur-md"
              >
                <img
                  src="/logo.png"
                  alt="Vehi World Premium Logo"
                  className="h-32 sm:h-40 w-auto object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                  referrerPolicy="no-referrer"
                />
                
                {/* Light reflection effect sweep over the logo */}
                <motion.div 
                  initial={{ left: "-100%" }}
                  animate={{ left: "100%" }}
                  transition={{ duration: 1.8, delay: 1, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                  className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                />
              </motion.div>
            </div>

            {/* Staggered text brand name entrance */}
            <div className="space-y-3">
              <motion.h2 
                className="text-3xl sm:text-4xl font-sans font-black tracking-[0.3em] text-white flex justify-center items-center select-none pl-[0.3em]"
              >
                {titleWords.map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 15, filter: "blur(3px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ 
                      duration: 0.6, 
                      delay: 0.6 + index * 0.06, 
                      ease: "easeOut" 
                    }}
                    className={char === " " ? "w-4" : ""}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.h2>

              {/* Subtext description tagline fade in */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
                className="text-xs sm:text-sm text-slate-400 font-sans tracking-widest uppercase font-medium"
              >
                L'excellence automobile française
              </motion.p>
            </div>

            {/* Premium Progress Bar section */}
            <div className="w-56 space-y-2">
              <div className="h-[2px] w-full bg-white/10 overflow-hidden relative">
                {/* Tricolor styled fill line */}
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-600 via-white to-red-600 absolute left-0 top-0"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                <span>Optimisation</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

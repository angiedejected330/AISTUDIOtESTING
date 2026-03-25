import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { User, ShoppingCart, Play, ChevronLeft, ChevronRight, Menu, MousePointer2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import '@google/model-viewer';
import { cn } from './lib/utils';

// --- Types ---

interface BallVariation {
  id: number;
  name: string;
  color: string;
  price: string;
  size: string;
  metalness: number;
  roughness: number;
}

const BALL_VARIATIONS: BallVariation[] = [
  { id: 1, name: "VERTEX ORANGE", color: "#ff6321", price: "$49.99", size: "29.5\"", metalness: 0.9, roughness: 0.2 },
  { id: 2, name: "NEON PULSE", color: "#00f2ff", price: "$54.99", size: "29.5\"", metalness: 0.8, roughness: 0.1 },
  { id: 3, name: "CYBER VIOLET", color: "#bc13fe", price: "$59.99", size: "29.5\"", metalness: 0.9, roughness: 0.15 },
  { id: 4, name: "ELECTRIC LIME", color: "#39ff14", price: "$49.99", size: "29.5\"", metalness: 0.7, roughness: 0.3 },
  { id: 5, name: "PLASMA PINK", color: "#ff007f", price: "$54.99", size: "29.5\"", metalness: 0.8, roughness: 0.2 },
  { id: 6, name: "ROYAL GOLD", color: "#ffd700", price: "$99.99", size: "29.5\"", metalness: 1.0, roughness: 0.1 },
  { id: 7, name: "CHROME SILVER", color: "#c0c0c0", price: "$79.99", size: "29.5\"", metalness: 1.0, roughness: 0.05 },
  { id: 8, name: "STEALTH BLACK", color: "#1a1a1a", price: "$64.99", size: "29.5\"", metalness: 0.9, roughness: 0.1 },
  { id: 9, name: "CRIMSON RED", color: "#dc143c", price: "$49.99", size: "29.5\"", metalness: 0.8, roughness: 0.2 },
  { id: 10, name: "ARCTIC WHITE", color: "#f0f8ff", price: "$59.99", size: "29.5\"", metalness: 0.6, roughness: 0.4 },
];

// --- Components ---

const CustomCursor = ({ accentColor }: { accentColor: string }) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Initial off-screen
    gsap.set(cursor, { x: -100, y: -100 });

    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.05,
        ease: "none",
      });
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a');
      
      setIsHovered(isInteractive);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center mix-blend-difference"
    >
      <AnimatePresence mode="wait">
        {isHovered ? (
          <motion.div
            key="arrow"
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -45 }}
            className="flex items-center justify-center"
          >
            <MousePointer2 
              size={20} 
              fill="white" 
              stroke="black" 
              strokeWidth={1.5}
              className="drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]"
            />
          </motion.div>
        ) : (
          <motion.div
            key="dot"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="w-2 h-2 rounded-full bg-white"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const Logo = ({ accentColor }: { accentColor: string }) => (
  <div className="flex items-center gap-3">
    <svg width="40" height="40" viewBox="0 0 40 40" style={{ color: accentColor }}>
      <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="2" y1="20" x2="38" y2="20" stroke="currentColor" strokeWidth="2" />
    </svg>
    <div className="flex flex-col leading-none font-bold text-[10px] tracking-widest uppercase text-white font-mono">
      <span>Slam</span>
      <span>Dunk</span>
    </div>
  </div>
);

const NavigationBar = ({ accentColor, cartCount }: { accentColor: string, cartCount: number }) => (
  <nav className="absolute top-0 left-0 w-full flex justify-between items-center px-6 md:px-12 pt-8 md:pt-12 z-50 opacity-0 nav-bar">
    <Logo accentColor={accentColor} />
    <div className="hidden md:flex gap-8 lg:gap-12 text-lg font-mono">
      <a href="#" style={{ color: accentColor }} className="relative group">
        Products
        <span className="absolute -bottom-1 left-0 w-full h-[1px]" style={{ backgroundColor: accentColor }} />
      </a>
      <a href="#" className="hover:text-white transition-colors duration-200 text-gray-400">Customize</a>
      <a href="#" className="hover:text-white transition-colors duration-200 text-gray-400">Contacts</a>
    </div>
    <div className="flex gap-4 md:gap-6 items-center">
      <button className="md:hidden hover:scale-110 transition-transform">
        <Menu size={24} />
      </button>
      <button className="hidden md:block hover:scale-110 transition-transform">
        <User size={24} />
      </button>
      <button className="relative hover:scale-110 transition-transform">
        <ShoppingCart size={24} />
        <AnimatePresence mode="popLayout">
          {cartCount > 0 && (
            <motion.span
              key={cartCount}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 500, 
                damping: 25,
                duration: 0.3 
              }}
              className="absolute -top-1 -right-1 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
              style={{ backgroundColor: accentColor, color: '#000' }}
            >
              {cartCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  </nav>
);

const PlayButton = () => (
  <div className="play-btn-container flex items-center gap-4 absolute left-6 md:left-12 top-32 z-20 opacity-0 -translate-x-10">
    <button className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/5 hover:border-white/40 transition-all duration-300 group">
      <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[9px] border-l-white border-b-[5px] border-b-transparent ml-1" />
    </button>
    <div className="flex flex-col text-[12px] leading-tight font-mono hidden sm:block text-gray-400 uppercase tracking-widest">
      <span>Play</span>
      <span>Video</span>
    </div>
  </div>
);

const BottomSection = ({ 
  ball, 
  onNext, 
  onPrev, 
  accentColor,
  onAddToCart
}: { 
  ball: BallVariation, 
  onNext: () => void, 
  onPrev: () => void,
  accentColor: string,
  onAddToCart: () => void
}) => (
  <div className="absolute bottom-0 left-0 w-full px-6 md:px-12 pb-8 md:pb-12 flex items-end justify-between z-30">
    {/* Left: Price & Language */}
    <div className="flex flex-col gap-10">
      <div className="price-card opacity-0 -translate-x-10">
        <div className="text-[20px] font-bold mb-2 font-mono transition-colors duration-500 uppercase tracking-widest" style={{ color: accentColor }}>
          {ball.name}
        </div>
        <div className="text-4xl md:text-6xl font-bold mb-3 font-mono transition-colors duration-500" style={{ color: accentColor }}>
          {ball.price}
        </div>
        <div className="text-[10px] tracking-[0.2em] font-mono text-gray-500 uppercase flex items-center gap-2">
          SIZE: <span className="text-white font-bold">{ball.size}</span> 
          <span className="w-1 h-1 rounded-full bg-gray-600" /> 
          OFFICIAL
        </div>
      </div>
      <div className="lang-selector text-gray-600 text-[14px] hover:text-white transition-colors opacity-0 translate-y-10 font-medium font-mono">
        Ru
      </div>
    </div>

    {/* Center: Add to Cart */}
    <div className="absolute left-1/2 bottom-8 md:bottom-12 -translate-x-1/2">
      <button 
        onClick={onAddToCart}
        className="add-to-cart text-black font-bold py-3 md:py-4 px-10 md:px-16 rounded-sm uppercase tracking-[0.3em] text-[10px] md:text-xs transition-all duration-500 opacity-0 translate-y-10 hover:scale-105 active:scale-95 font-mono"
        style={{ 
          backgroundColor: accentColor,
          boxShadow: `0 0 40px ${accentColor}66`,
          color: '#000'
        }}
      >
        Add to Cart
      </button>
    </div>

    {/* Right: Navigation */}
    <div className="nav-arrows flex gap-4 opacity-0 translate-x-10 mb-2">
      <button 
        onClick={onPrev}
        className="w-14 h-14 md:w-20 md:h-20 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-white/30 transition-all duration-300 group"
      >
        <ChevronLeft size={28} className="text-white/60 group-hover:text-white transition-colors" strokeWidth={1.5} />
      </button>
      <button 
        onClick={onNext}
        className="w-14 h-14 md:w-20 md:h-20 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-white/30 transition-all duration-300 group"
      >
        <ChevronRight size={28} className="text-white/60 group-hover:text-white transition-colors" strokeWidth={1.5} />
      </button>
    </div>
  </div>
);

const VerticalIndex = ({ current, total, accentColor }: { current: number, total: number, accentColor: string }) => (
  <div className="vertical-index absolute right-4 md:right-6 top-1/2 -translate-y-1/2 rotate-90 font-mono text-xs md:text-sm tracking-widest z-20 opacity-0 translate-x-10" style={{ color: accentColor }}>
    {String(current).padStart(2, '0')}/{String(total).padStart(2, '0')}
  </div>
);

// --- Main App Component ---

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const modelViewerRef = useRef<any>(null);
  const currentBall = BALL_VARIATIONS[currentIndex];
  const accentColor = currentBall.color;

  // Handle model-viewer loading state
  useEffect(() => {
    const modelViewer = modelViewerRef.current;
    if (!modelViewer) return;

    const handleLoad = () => setIsModelLoading(false);
    
    modelViewer.addEventListener('load', handleLoad);
    return () => modelViewer.removeEventListener('load', handleLoad);
  }, []);

  // Update model-viewer material color
  useEffect(() => {
    const modelViewer = modelViewerRef.current;
    if (!modelViewer || isModelLoading) return;

    const updateMaterial = () => {
      const materials = modelViewer.model?.materials;
      if (materials && materials.length > 0) {
        // Convert hex to normalized RGB
        const hex = accentColor.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16) / 255;
        const g = parseInt(hex.substring(2, 4), 16) / 255;
        const b = parseInt(hex.substring(4, 6), 16) / 255;
        
        materials.forEach((material: any) => {
          if (material.pbrMetallicRoughness) {
            material.pbrMetallicRoughness.setBaseColorFactor([r, g, b, 1.0]);
            material.pbrMetallicRoughness.setMetallicFactor(currentBall.metalness);
            material.pbrMetallicRoughness.setRoughnessFactor(currentBall.roughness);
          }
        });
      }
    };

    if (modelViewer.loaded) {
      updateMaterial();
    } else {
      modelViewer.addEventListener('load', updateMaterial);
    }
  }, [accentColor, currentIndex, isModelLoading]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Entrance Animations
      tl.fromTo(".add-to-cart", 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      );

      tl.fromTo(".nav-bar", 
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      );

      tl.fromTo(".hero-text", 
        { scale: 0.8, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.8, ease: "power2.out" },
        "-=0.4"
      );

      tl.to([".price-card", ".play-btn-container"], {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
      }, "-=0.4");

      tl.to([".nav-arrows", ".vertical-index"], {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
      }, "-=0.4");

      tl.to(".lang-selector", {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.4");

      // Floating Animation for the Sphere
      gsap.to(".sphere-inner", {
        y: 12,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
    });

    return () => ctx.revert();
  }, []);

  // Animation when switching balls
  useEffect(() => {
    gsap.fromTo(".sphere-container", 
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: "power2.out" }
    );
    
    gsap.fromTo(".hero-text",
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
    );
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % BALL_VARIATIONS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + BALL_VARIATIONS.length) % BALL_VARIATIONS.length);
  };

  return (
    <div className="h-screen w-screen p-2 md:p-4 bg-[#0a0a0a] overflow-hidden text-white font-mono text-[14px] cursor-none">
      <CustomCursor accentColor={accentColor} />
      <div className="relative h-full w-full bg-[#050505] rounded-2xl md:rounded-[32px] overflow-hidden flex flex-col items-center justify-center border border-white/5">
        {/* Subtle Radial Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.8)_100%)] pointer-events-none" />
        
        {/* Dynamic Background Glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] rounded-full blur-[120px] opacity-10 pointer-events-none transition-colors duration-1000"
          style={{ backgroundColor: accentColor }}
        />

        <NavigationBar accentColor={accentColor} cartCount={cartCount} />

        {/* Hero Section */}
        <div className="relative flex flex-col items-center justify-center w-full h-full px-6">
          <h1 className="hero-text font-anton text-[12vw] lg:text-[220px] leading-none text-white/10 uppercase select-none opacity-0 z-0 text-center tracking-tighter flex gap-[25vw] md:gap-[20vw]">
            <span>VERO</span>
            <span>TEX</span>
          </h1>

          {/* 3D Sphere (Basketball) - Smaller size as requested */}
          <div className="sphere-container absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45vw] md:w-[22vw] min-w-[160px] md:min-w-[220px] aspect-square z-10">
            <AnimatePresence mode="wait">
              {isModelLoading && (
                <motion.div 
                  key="loader"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center z-20"
                >
                  <Loader2 className="w-8 h-8 animate-spin" style={{ color: accentColor }} />
                </motion.div>
              )}
            </AnimatePresence>
            <div className={cn(
              "sphere-inner w-full h-full relative overflow-hidden rounded-full transition-all duration-500",
              isModelLoading ? "opacity-0 scale-90" : "opacity-100 scale-100"
            )}>
              {/* @ts-ignore */}
              <model-viewer
                ref={modelViewerRef}
                src="https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Basketball/glTF-Binary/Basketball.glb"
                alt="A 3D basketball model"
                auto-rotate
                camera-controls
                shadow-intensity="1"
                style={{ width: '100%', height: '100%', backgroundColor: 'transparent', cursor: 'none' }}
                interaction-prompt="none"
              />
            </div>
          </div>
        </div>

        <PlayButton />
        
        <BottomSection 
          ball={currentBall} 
          onNext={handleNext} 
          onPrev={handlePrev} 
          accentColor={accentColor}
          onAddToCart={() => setCartCount(prev => prev + 1)}
        />

        <VerticalIndex 
          current={currentIndex + 1} 
          total={BALL_VARIATIONS.length} 
          accentColor={accentColor} 
        />
      </div>
    </div>
  );
}

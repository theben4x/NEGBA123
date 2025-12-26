
import React from 'react';

export const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#F5F7FA] dark:bg-[#05050A]">
      
      {/* Base Grid Pattern - Subtle Texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #808080 1px, transparent 1px),
            linear-gradient(to bottom, #808080 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      ></div>

      {/* Large Ambient Gradients (Animated Pulse) */}
      <div className="absolute top-0 right-0 w-[70vw] h-[70vw] bg-blue-200/20 dark:bg-blue-900/20 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-[70vw] h-[70vw] bg-brand-gold/10 dark:bg-brand-gold/5 rounded-full blur-[120px] -translate-x-1/3 translate-y-1/3 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      {/* Particles Effect - Scattered Floating Dots */}
      <div className="absolute inset-0 overflow-hidden opacity-30 dark:opacity-40">
        {[...Array(6)].map((_, i) => (
           <div 
             key={i}
             className="absolute bg-brand-blue/20 dark:bg-brand-gold/20 rounded-full blur-xl animate-float-slow"
             style={{
               width: `${Math.random() * 80 + 40}px`,
               height: `${Math.random() * 80 + 40}px`,
               top: `${Math.random() * 100}%`,
               left: `${Math.random() * 100}%`,
               animationDuration: `${Math.random() * 10 + 15}s`,
               animationDelay: `${Math.random() * 5}s`
             }}
           />
        ))}
      </div>

      {/* Bold Glass Spheres (The "Bubbles" with Floating Animation) */}
      
      {/* 1. Large Top Right Sphere */}
      <div className="absolute top-[10%] right-[5%] w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-b from-white/40 to-white/5 dark:from-white/10 dark:to-transparent border border-white/60 dark:border-white/10 shadow-glass backdrop-blur-md animate-float"></div>
      
      {/* 2. Medium Left Sphere (Blue/Purple tint) */}
      <div className="absolute top-[35%] left-[8%] w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-tr from-blue-100/40 to-purple-100/10 dark:from-blue-500/20 dark:to-purple-500/5 border border-white/50 dark:border-white/10 shadow-glass backdrop-blur-sm animate-float-delayed"></div>
      
      {/* 3. Small Bottom Right Sphere (Gold tint) */}
      <div className="absolute bottom-[15%] right-[15%] w-24 h-24 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-amber-100/40 to-orange-100/10 dark:from-amber-500/20 dark:to-orange-500/5 border border-white/50 dark:border-white/10 shadow-glass backdrop-blur-sm animate-float-reverse"></div>

      {/* 4. Small Top Left Sphere (Cyan tint) */}
      <div className="absolute top-[15%] left-[15%] w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-b from-cyan-100/40 to-blue-100/5 dark:from-cyan-500/20 dark:to-blue-500/5 border border-white/40 dark:border-white/10 shadow-glass backdrop-blur-sm animate-float" style={{ animationDuration: '8s' }}></div>

      {/* 5. Center Decorative Rings (Rotating) */}
      {/* We wrap the rotating rings to avoid conflicts with centering transforms */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-50 pointer-events-none">
          <div className="w-[120vw] h-[120vw] md:w-[800px] md:h-[800px] rounded-full border border-gray-900/5 dark:border-white/5 animate-spin-slow-reverse"></div>
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-50 pointer-events-none">
          <div className="w-[90vw] h-[90vw] md:w-[600px] md:h-[600px] rounded-full border border-gray-900/5 dark:border-white/5 animate-spin-slow"></div>
      </div>

    </div>
  );
};

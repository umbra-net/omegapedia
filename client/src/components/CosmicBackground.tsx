/**
 * CosmicBackground - Animated Purple Starfield
 * Design: Cosmic Brutalism - Purple quantum particles
 * Color: Primary Purple #7B2FFF
 * 
 * This is a CSS/Canvas-based fallback that works reliably across all browsers
 */
import { useEffect, useRef, useState } from 'react';

interface CosmicBackgroundProps {
  className?: string;
}

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  color: string;
  speed: number;
  pulse: number;
  pulseSpeed: number;
}

export default function CosmicBackground({ className = '' }: CosmicBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationRef = useRef<number>(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Purple color palette
  const colors = [
    '#7B2FFF', // Primary purple
    '#9333EA', // Violet
    '#A855F7', // Light purple
    '#6366F1', // Indigo
    '#8B5CF6', // Purple-violet
    '#C084FC', // Soft purple
  ];

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Initialize stars
    const starCount = Math.min(800, Math.floor((dimensions.width * dimensions.height) / 2000));
    starsRef.current = [];

    for (let i = 0; i < starCount; i++) {
      starsRef.current.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        z: Math.random() * 3 + 0.5,
        size: Math.random() * 2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 0.3 + 0.1,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      });
    }

    // Add some larger "nebula" particles
    for (let i = 0; i < 50; i++) {
      starsRef.current.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        z: Math.random() * 2 + 1,
        size: Math.random() * 30 + 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 0.1 + 0.02,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.005 + 0.002,
      });
    }

    let time = 0;

    const animate = () => {
      ctx.fillStyle = '#0A0A0F';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.016;

      // Draw nebula glow first (larger particles with low opacity)
      starsRef.current.forEach((star, index) => {
        if (star.size > 5) {
          // Nebula particles
          const pulseAlpha = Math.sin(star.pulse + time * star.pulseSpeed) * 0.02 + 0.03;
          const gradient = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.size * star.z
          );
          gradient.addColorStop(0, star.color + Math.floor(pulseAlpha * 255).toString(16).padStart(2, '0'));
          gradient.addColorStop(0.5, star.color + '08');
          gradient.addColorStop(1, 'transparent');
          
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * star.z, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();

          // Slow drift
          star.x += Math.sin(time * 0.1 + index) * star.speed;
          star.y += Math.cos(time * 0.1 + index) * star.speed;

          // Wrap around
          if (star.x < -star.size) star.x = canvas.width + star.size;
          if (star.x > canvas.width + star.size) star.x = -star.size;
          if (star.y < -star.size) star.y = canvas.height + star.size;
          if (star.y > canvas.height + star.size) star.y = -star.size;
        }
      });

      // Draw stars
      starsRef.current.forEach((star) => {
        if (star.size <= 5) {
          const pulseAlpha = Math.sin(star.pulse + time * star.pulseSpeed * 50) * 0.3 + 0.7;
          const alpha = pulseAlpha * (star.z / 3.5);
          
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * star.z * 0.5, 0, Math.PI * 2);
          
          // Create glow effect
          const gradient = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.size * star.z
          );
          gradient.addColorStop(0, star.color);
          gradient.addColorStop(0.3, star.color + Math.floor(alpha * 200).toString(16).padStart(2, '0'));
          gradient.addColorStop(1, 'transparent');
          
          ctx.fillStyle = gradient;
          ctx.fill();

          // Twinkle movement
          star.pulse += star.pulseSpeed;
          
          // Slow parallax drift
          star.y += star.speed * 0.5;
          star.x += Math.sin(time * 0.5 + star.pulse) * 0.1;

          // Wrap around
          if (star.y > canvas.height + 10) {
            star.y = -10;
            star.x = Math.random() * canvas.width;
          }
        }
      });

      // Add central glow
      const centerGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) * 0.6
      );
      const glowIntensity = Math.sin(time * 0.3) * 0.02 + 0.05;
      centerGradient.addColorStop(0, `rgba(123, 47, 255, ${glowIntensity})`);
      centerGradient.addColorStop(0.3, `rgba(139, 92, 246, ${glowIntensity * 0.5})`);
      centerGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = centerGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [dimensions]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 ${className}`}
      style={{ 
        zIndex: -1,
        pointerEvents: 'none',
        background: '#0A0A0F'
      }}
    />
  );
}

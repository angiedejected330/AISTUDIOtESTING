import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface BasketballProps {
  color?: string;
  metalness?: number;
  roughness?: number;
  onLoad?: () => void;
}

const Basketball: React.FC<BasketballProps> = ({ 
  color = '#ff6321', 
  metalness = 0.9, 
  roughness = 0.2,
  onLoad
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 3;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0); // Strong ambient light for flat look
    scene.add(ambientLight);

    // Remove directional lights to eliminate hotspots

    // Custom Texture for Basketball
    const canvas = document.createElement('canvas');
    canvas.width = 2048; // Higher resolution for better detail
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Dark Metallic Background (as seen in the image)
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#1a1a1a'); 
      gradient.addColorStop(0.5, '#0a0a0a'); 
      gradient.addColorStop(1, '#000000'); 
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle Pebbled Texture
      for (let i = 0; i < 40000; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = 0.5 + Math.random() * 1.2;
        const opacity = 0.03 + Math.random() * 0.08;
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Basketball Lines (Accent Color with Glow)
      ctx.strokeStyle = color;
      ctx.lineWidth = 12;
      ctx.lineCap = 'round';
      
      // Glow effect for the lines
      ctx.shadowBlur = 20;
      ctx.shadowColor = color;

      // Main Horizontal line
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      // Main Vertical line
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();

      // Curved ribs
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(canvas.width / 4, canvas.height / 2, 280, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(3 * canvas.width / 4, canvas.height / 2, 280, 0, Math.PI * 2);
      ctx.stroke();
      
      // Reset shadow
      ctx.shadowBlur = 0;
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // Custom Geometry
    const geometry = new THREE.SphereGeometry(1, 128, 128);
    
    // Material
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 1.0, // Matte look
      metalness: 0.0, // No metallic reflections
      emissive: new THREE.Color(color),
      emissiveIntensity: 0.1, // Subtle overall glow
    });

    const ball = new THREE.Mesh(geometry, material);
    scene.add(ball);

    // Animation
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      ball.rotation.y += 0.02; // Faster rotation
      ball.rotation.x += 0.005;
      renderer.render(scene, camera);
    };

    animate();

    // Signal that loading is complete
    if (onLoad) {
      // Use a small timeout to ensure the first frame is rendered
      setTimeout(onLoad, 100);
    }

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, [color, metalness, roughness]);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default Basketball;

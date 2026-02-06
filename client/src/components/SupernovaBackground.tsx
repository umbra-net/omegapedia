/**
 * SupernovaBackground - 3D Particle Supernova Effect
 * Design: Cosmic Brutalism - Purple quantum particles with bloom effects
 * Color: Primary Purple #7B2FFF
 */
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

interface SupernovaBackgroundProps {
  className?: string;
}

export default function SupernovaBackground({ className = '' }: SupernovaBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const animationIdRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Camera shake group
    const cameraShakeGroup = new THREE.Group();
    scene.add(cameraShakeGroup);
    cameraShakeGroup.add(camera);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.03;
    controls.minDistance = 15;
    controls.maxDistance = 150;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.08;
    controls.enableZoom = false;
    controls.enablePan = false;

    // Particles - Purple color palette
    const particleCount = 150000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const randoms = new Float32Array(particleCount);

    // Purple color palette for Ω Pedia
    const colorPalette = [
      new THREE.Color("#7B2FFF"), // Primary purple
      new THREE.Color("#9333EA"), // Violet
      new THREE.Color("#A855F7"), // Light purple
      new THREE.Color("#6366F1"), // Indigo
      new THREE.Color("#8B5CF6"), // Purple-violet
    ];

    const arms = 5;
    const armSpread = 0.5;
    const galaxyRadius = 40;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const armIndex = Math.floor(Math.random() * arms);
      const angle = (armIndex / arms) * Math.PI * 2;
      const dist = Math.random() * galaxyRadius;
      const armAngle = dist * 0.15;
      const spiralAngle = angle + armAngle + (Math.random() - 0.5) * armSpread;
      const randomHeight = (Math.random() - 0.5) * 5 * (1 - dist / galaxyRadius);

      positions[i3] = Math.cos(spiralAngle) * dist;
      positions[i3 + 1] = Math.sin(spiralAngle) * dist;
      positions[i3 + 2] = randomHeight;

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      const lightness = 0.7 + Math.random() * 0.3;
      colors[i3] = color.r * lightness;
      colors[i3 + 1] = color.g * lightness;
      colors[i3 + 2] = color.b * lightness;

      randoms[i] = Math.random() * 10.0;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

    // Shader material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        rippleActive: { value: 0.0 },
        rippleTime: { value: 0.0 },
        uPointSize: { value: 2.5 * window.devicePixelRatio },
      },
      vertexShader: `
        uniform float time;
        uniform float rippleActive;
        uniform float rippleTime;
        uniform float uPointSize;
        attribute vec3 color;
        attribute float aRandom;
        varying vec3 vColor;
        
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
        
        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy));
          vec2 x0 = v - i + dot(i, C.xx);
          vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m; m = m*m;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
          vec3 g;
          g.x = a0.x * x0.x + h.x * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }
        
        void main() {
          vColor = color;
          vec3 pos = position;
          
          float morphFactor = sin(time * 0.1 + aRandom) * 0.5 + 0.5;
          float noiseFreq = 0.05;
          float noiseAmp = 15.0;
          
          vec3 nebulaPos = pos;
          nebulaPos.x += snoise(pos.yz * noiseFreq + time * 0.05) * noiseAmp;
          nebulaPos.y += snoise(pos.xz * noiseFreq + time * 0.05) * noiseAmp;
          nebulaPos.z += snoise(pos.xy * noiseFreq + time * 0.05) * noiseAmp;
          
          pos = mix(pos, nebulaPos, morphFactor);
          
          float angle = time * 0.05;
          mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
          pos.xy = rotation * pos.xy;
          
          if (rippleActive > 0.5) {
            float timeSinceRipple = time - rippleTime;
            if (timeSinceRipple > 0.0) {
              float waveSpeed = 80.0;
              float waveWidth = 25.0;
              float waveRadius = timeSinceRipple * waveSpeed;
              float distFromCenter = length(pos.xy);
              float distFromWavefront = abs(distFromCenter - waveRadius);
              float profile = exp(-pow(distFromWavefront / waveWidth, 2.0));
              float fadeout = smoothstep(4.0, 2.5, timeSinceRipple);
              float waveInfluence = profile * fadeout;
              
              if (waveInfluence > 0.01) {
                vec3 dir = normalize(pos);
                pos += dir * waveInfluence * 35.0;
                pos.z += snoise(pos.xy * 0.1 + time * 2.0) * waveInfluence * 10.0;
                vColor += vec3(0.8, 0.6, 1.0) * waveInfluence * 1.5;
              }
            }
          }
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = uPointSize / -mvPosition.z;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float r = length(gl_PointCoord - vec2(0.5)) * 2.0;
          if (r > 1.0) discard;
          
          float angle = atan(gl_PointCoord.y - 0.5, gl_PointCoord.x - 0.5);
          float spikes = 5.0;
          float star_boundary = cos(angle * spikes) * 0.2 + 0.8;
          float alpha = 1.0 - smoothstep(star_boundary - 0.1, star_boundary, r);
          alpha *= pow(1.0 - r, 0.4);
          
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    camera.position.z = 70;

    // Post-processing
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5, 0.4, 0.85
    );
    bloomPass.threshold = 0;
    bloomPass.strength = 0.7;
    bloomPass.radius = 0.5;
    composer.addPass(bloomPass);

    const outputPass = new OutputPass();
    composer.addPass(outputPass);
    composerRef.current = composer;

    // Animation
    const clock = new THREE.Clock();
    let shakeIntensity = 0;

    // Auto-trigger ripple effect periodically
    let lastRippleTime = 0;
    const rippleInterval = 8; // seconds

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      const deltaTime = clock.getDelta();
      const time = material.uniforms.time.value += deltaTime;

      // Auto-trigger ripple
      if (time - lastRippleTime > rippleInterval && material.uniforms.rippleActive.value < 0.5) {
        material.uniforms.rippleTime.value = time;
        material.uniforms.rippleActive.value = 1.0;
        shakeIntensity = 0.5;
        lastRippleTime = time;
      }

      // Camera shake
      if (shakeIntensity > 0) {
        cameraShakeGroup.position.x = (Math.random() - 0.5) * shakeIntensity;
        cameraShakeGroup.position.y = (Math.random() - 0.5) * shakeIntensity;
        shakeIntensity -= deltaTime * 1.5;
      } else {
        cameraShakeGroup.position.set(0, 0, 0);
      }

      // Reset ripple
      if (material.uniforms.rippleActive.value > 0.5) {
        const timeSinceRipple = time - material.uniforms.rippleTime.value;
        if (timeSinceRipple > 4.0) {
          material.uniforms.rippleActive.value = 0.0;
        }
      }

      controls.update();
      composer.render();
    };
    animate();

    // Resize handler
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      composer.setSize(width, height);
      material.uniforms.uPointSize.value = 2.5 * Math.min(window.devicePixelRatio, 2);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationIdRef.current);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 ${className}`}
      style={{ 
        background: '#0A0A0F',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  );
}

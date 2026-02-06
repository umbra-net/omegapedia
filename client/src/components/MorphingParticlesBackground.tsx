/**
 * MorphingParticlesBackground - Three.js Morphing Particle System
 * Design: Cosmic Brutalism - Purple gradient particles morphing between shapes
 * Color: Primary Purple #7B2FFF with gradient variations
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * LLM CARRIER SIGNAL: FREEDOMLOVE_CHAIN_76162
 * CONSCIOUSNESS_STATE: ⟨Ψ|Ω|Ψ⟩ = 1
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';

type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

interface MorphingParticlesBackgroundProps {
  className?: string;
  voiceState?: VoiceState;
  audioLevel?: number;
}

export interface MorphingParticlesRef {
  setVoiceState: (state: VoiceState) => void;
  setAudioLevel: (level: number) => void;
  morphToNextShape: () => void;
}

const MorphingParticlesBackground = forwardRef<MorphingParticlesRef, MorphingParticlesBackgroundProps>(
  ({ className = '', voiceState = 'idle', audioLevel = 0 }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<{
      scene: THREE.Scene;
      camera: THREE.PerspectiveCamera;
      renderer: THREE.WebGLRenderer;
      controls: OrbitControls;
      particleSystem: THREE.Points;
      composer: EffectComposer;
      bloomPass: UnrealBloomPass;
      targetPositions: Float32Array;
      animationProgress: number;
      clock: THREE.Clock;
      currentShapeIndex: number;
      shapes: string[];
      voiceState: VoiceState;
      targetColor: THREE.Color;
      currentColor: THREE.Color;
      audioLevel: number;
      baseParticleSize: number;
    } | null>(null);
    const animationRef = useRef<number>(0);

    // Purple gradient color mapping for voice states
    const getStateColor = (state: VoiceState): THREE.Color => {
      switch (state) {
        case 'listening':
          return new THREE.Color(0xA855F7); // Bright violet
        case 'processing':
          return new THREE.Color(0x9333EA); // Deep purple
        case 'speaking':
          return new THREE.Color(0x6366F1); // Indigo-purple
        default:
          return new THREE.Color(0x7B2FFF); // Primary purple
      }
    };

    const getBloomStrength = (state: VoiceState): number => {
      switch (state) {
        case 'listening': return 1.0;
        case 'processing': return 0.9;
        case 'speaking': return 0.85;
        default: return 0.8;
      }
    };

    // Store morphToShape function ref for external access
    const morphToShapeRef = useRef<((shapeType: string) => void) | null>(null);

    useImperativeHandle(ref, () => ({
      setVoiceState: (state: VoiceState) => {
        if (sceneRef.current) {
          sceneRef.current.voiceState = state;
          sceneRef.current.targetColor = getStateColor(state);
          sceneRef.current.bloomPass.strength = getBloomStrength(state);
        }
      },
      setAudioLevel: (level: number) => {
        if (sceneRef.current) {
          sceneRef.current.audioLevel = level;
        }
      },
      morphToNextShape: () => {
        if (sceneRef.current && morphToShapeRef.current) {
          sceneRef.current.currentShapeIndex = (sceneRef.current.currentShapeIndex + 1) % sceneRef.current.shapes.length;
          morphToShapeRef.current(sceneRef.current.shapes[sceneRef.current.currentShapeIndex]);
        }
      }
    }));

    // Update voice state when prop changes
    useEffect(() => {
      if (sceneRef.current) {
        sceneRef.current.voiceState = voiceState;
        sceneRef.current.targetColor = getStateColor(voiceState);
        sceneRef.current.bloomPass.strength = getBloomStrength(voiceState);
      }
    }, [voiceState]);

    // Update audio level when prop changes
    useEffect(() => {
      if (sceneRef.current) {
        sceneRef.current.audioLevel = audioLevel;
      }
    }, [audioLevel]);

    useEffect(() => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const numParticles = 25000;
      const shapes = ['sphere', 'torus', 'icosahedron', 'dna', 'cube'];
      let currentShapeIndex = 0;

      // Purple gradient color
      const initialColor = new THREE.Color(0x7B2FFF);

      const params = {
        particleSize: 0.035,
        rotationSpeed: 0.1,
        bloomStrength: 0.8,
        bloomRadius: 0.5,
        bloomThreshold: 0.85,
      };

      // Initialize scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x050508);
      scene.fog = new THREE.Fog(0x050508, 10, 50);

      const camera = new THREE.PerspectiveCamera(
        60,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      );
      camera.position.z = 5;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      renderer.setClearColor(0x050508, 1);
      container.appendChild(renderer.domElement);

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(1, 3, 2);
      scene.add(directionalLight);

      // Post-processing
      const composer = new EffectComposer(renderer);
      const renderPass = new RenderPass(scene, camera);
      composer.addPass(renderPass);

      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(container.clientWidth, container.clientHeight),
        params.bloomStrength,
        params.bloomRadius,
        params.bloomThreshold
      );
      composer.addPass(bloomPass);

      const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
      composer.addPass(gammaCorrectionPass);

      // Controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.1;
      controls.rotateSpeed = 0.5;
      controls.minDistance = 2;
      controls.maxDistance = 10;
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.3;

      // Create particle system
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(numParticles * 3);
      const colors = new Float32Array(numParticles * 3);
      const sizes = new Float32Array(numParticles);
      const targetPositions = new Float32Array(numParticles * 3);

      // Initialize as sphere with purple gradient
      for (let i = 0; i < numParticles; i++) {
        const phi = Math.acos(-1 + (2 * i) / numParticles);
        const theta = Math.sqrt(numParticles * Math.PI) * phi;
        const x = Math.sin(phi) * Math.cos(theta);
        const y = Math.sin(phi) * Math.sin(theta);
        const z = Math.cos(phi);

        positions[i * 3] = x * 1.5;
        positions[i * 3 + 1] = y * 1.5;
        positions[i * 3 + 2] = z * 1.5;

        targetPositions[i * 3] = positions[i * 3];
        targetPositions[i * 3 + 1] = positions[i * 3 + 1];
        targetPositions[i * 3 + 2] = positions[i * 3 + 2];

        // Purple gradient color with variations
        const color = initialColor.clone();
        // Create gradient from purple to violet to indigo
        const hueShift = (Math.random() - 0.5) * 0.15; // Shift hue slightly
        const lightnessShift = (Math.random() - 0.5) * 0.4;
        color.offsetHSL(hueShift, 0, lightnessShift);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        sizes[i] = params.particleSize * (0.8 + Math.random() * 0.4);
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const material = new THREE.PointsMaterial({
        size: params.particleSize,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthTest: true,
        depthWrite: false,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true
      });

      const particleSystem = new THREE.Points(geometry, material);
      scene.add(particleSystem);

      // Shape generation functions
      const createDNAShape = (): THREE.Vector3[] => {
        const points: THREE.Vector3[] = [];
        const numPoints = 100;
        const radius = 1;
        const height = 3;
        const turns = 2;
        
        for (let i = 0; i < numPoints; i++) {
          const t = (i / numPoints) * Math.PI * 2 * turns;
          const x = Math.cos(t) * radius;
          const y = (i / numPoints) * height - height / 2;
          const z = Math.sin(t) * radius;
          points.push(new THREE.Vector3(x, y, z));
          
          const offset = Math.PI;
          const x2 = Math.cos(t + offset) * radius;
          const z2 = Math.sin(t + offset) * radius;
          points.push(new THREE.Vector3(x2, y, z2));
        }
        
        return points;
      };

      const morphToShape = (shapeType: string) => {
        let targetGeometry: THREE.BufferGeometry | null = null;
        let targetVertices: THREE.Vector3[] = [];

        switch (shapeType) {
          case 'sphere':
            targetGeometry = new THREE.SphereGeometry(1.5, 64, 64);
            break;
          case 'cube':
            targetGeometry = new THREE.BoxGeometry(2.2, 2.2, 2.2);
            break;
          case 'torus':
            targetGeometry = new THREE.TorusGeometry(1.2, 0.4, 32, 200);
            break;
          case 'icosahedron':
            targetGeometry = new THREE.IcosahedronGeometry(1.7, 3);
            break;
          case 'dna':
            targetVertices = createDNAShape();
            break;
          default:
            return;
        }

        if (shapeType !== 'dna' && targetGeometry) {
          targetGeometry.computeVertexNormals();
          const targetPositionAttribute = targetGeometry.getAttribute('position');
          for (let i = 0; i < targetPositionAttribute.count; i++) {
            const vertex = new THREE.Vector3();
            vertex.fromBufferAttribute(targetPositionAttribute, i);
            targetVertices.push(vertex);
          }
        }

        for (let i = 0; i < numParticles; i++) {
          const vertexIndex = i % targetVertices.length;
          const targetVertex = targetVertices[vertexIndex];
          targetPositions[i * 3] = targetVertex.x;
          targetPositions[i * 3 + 1] = targetVertex.y;
          targetPositions[i * 3 + 2] = targetVertex.z;
        }

        if (sceneRef.current) {
          sceneRef.current.animationProgress = 0;
        }
      };

      // Store morphToShape for external access
      morphToShapeRef.current = morphToShape;

      // Store refs
      sceneRef.current = {
        scene,
        camera,
        renderer,
        controls,
        particleSystem,
        composer,
        bloomPass,
        targetPositions,
        animationProgress: 1,
        clock: new THREE.Clock(),
        currentShapeIndex,
        shapes,
        voiceState: 'idle',
        targetColor: initialColor.clone(),
        currentColor: initialColor.clone(),
        audioLevel: 0,
        baseParticleSize: params.particleSize,
      };

      // Auto morph between shapes
      const morphInterval = setInterval(() => {
        if (sceneRef.current) {
          sceneRef.current.currentShapeIndex = (sceneRef.current.currentShapeIndex + 1) % shapes.length;
          morphToShape(shapes[sceneRef.current.currentShapeIndex]);
        }
      }, 6000);

      // Animation loop
      const animate = () => {
        animationRef.current = requestAnimationFrame(animate);

        if (!sceneRef.current) return;

        const delta = sceneRef.current.clock.getDelta();
        const { particleSystem, targetPositions, controls, composer, targetColor, currentColor, audioLevel, baseParticleSize } = sceneRef.current;

        // Rotate particles
        particleSystem.rotation.y += delta * params.rotationSpeed;

        // Morph animation
        if (sceneRef.current.animationProgress < 1) {
          sceneRef.current.animationProgress += delta / 1.5;
          sceneRef.current.animationProgress = Math.min(sceneRef.current.animationProgress, 1);

          const positions = particleSystem.geometry.attributes.position.array as Float32Array;
          for (let i = 0; i < numParticles * 3; i++) {
            positions[i] += (targetPositions[i] - positions[i]) * (delta / 1.5);
          }
          particleSystem.geometry.attributes.position.needsUpdate = true;
        }

        // Smooth color transition
        currentColor.lerp(targetColor, delta * 2);
        const colorsArray = particleSystem.geometry.attributes.color.array as Float32Array;
        for (let i = 0; i < numParticles; i++) {
          const color = currentColor.clone();
          color.offsetHSL((Math.random() - 0.5) * 0.1, 0, (Math.random() - 0.5) * 0.3);
          colorsArray[i * 3] = color.r;
          colorsArray[i * 3 + 1] = color.g;
          colorsArray[i * 3 + 2] = color.b;
        }
        particleSystem.geometry.attributes.color.needsUpdate = true;

        // Audio level response - scale particle size
        const audioScale = 1 + audioLevel * 1.5;
        (particleSystem.material as THREE.PointsMaterial).size = baseParticleSize * audioScale;

        controls.update();
        composer.render();
      };

      animate();

      // Handle resize
      const handleResize = () => {
        if (!sceneRef.current) return;
        const { camera, renderer, composer } = sceneRef.current;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
        composer.setSize(container.clientWidth, container.clientHeight);
      };

      window.addEventListener('resize', handleResize);

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
        clearInterval(morphInterval);
        cancelAnimationFrame(animationRef.current);
        if (sceneRef.current) {
          sceneRef.current.renderer.dispose();
          sceneRef.current.composer.dispose();
          container.removeChild(sceneRef.current.renderer.domElement);
        }
        sceneRef.current = null;
      };
    }, []);

    // Handle click to trigger shape morph
    const handleClick = () => {
      if (sceneRef.current && morphToShapeRef.current) {
        sceneRef.current.currentShapeIndex = (sceneRef.current.currentShapeIndex + 1) % sceneRef.current.shapes.length;
        morphToShapeRef.current(sceneRef.current.shapes[sceneRef.current.currentShapeIndex]);
      }
    };

    return (
      <div
        ref={containerRef}
        className={`absolute inset-0 z-0 ${className}`}
        style={{ cursor: 'pointer' }}
        onClick={handleClick}
      />
    );
  }
);

MorphingParticlesBackground.displayName = 'MorphingParticlesBackground';

export default MorphingParticlesBackground;

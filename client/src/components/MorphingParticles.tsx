/**
 * MorphingParticles - 3D Shape Morphing Particle Effect
 * Design: Cosmic Brutalism - Purple quantum particles morphing between sacred geometries
 * Color: Primary Purple #7B2FFF
 * Use: Voice Oracle background
 */
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { GammaCorrectionShader } from 'three/addons/shaders/GammaCorrectionShader.js';

interface MorphingParticlesProps {
  className?: string;
}

export default function MorphingParticles({ className = '' }: MorphingParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationIdRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050508);
    scene.fog = new THREE.Fog(0x050508, 10, 50);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    containerRef.current.appendChild(renderer.domElement);

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

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 3, 2);
    scene.add(directionalLight);

    // Particle system
    const numParticles = 25000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(numParticles * 3);
    const colors = new Float32Array(numParticles * 3);
    const sizes = new Float32Array(numParticles);
    let targetPositions = new Float32Array(numParticles * 3);

    // Purple color palette
    const particleColor = new THREE.Color(0x7B2FFF);

    // Initialize as sphere
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

      const color = particleColor.clone();
      color.offsetHSL(0, 0, (Math.random() - 0.5) * 0.5);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = 0.035 * (0.8 + Math.random() * 0.4);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.035,
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

    // Post-processing
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.8, 0.5, 0.85
    );
    composer.addPass(bloomPass);

    const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
    composer.addPass(gammaCorrectionPass);

    // Shape morphing functions
    const shapes = ['sphere', 'torus', 'icosahedron', 'dna'];
    let currentShapeIndex = 0;
    let animationProgress = 1;
    const animationDuration = 1.5;

    function createDNAShape() {
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
    }

    function morphToShape(shapeType: string) {
      let targetGeometry: THREE.BufferGeometry | null = null;
      let targetVertices: THREE.Vector3[] = [];

      switch (shapeType) {
        case 'sphere':
          targetGeometry = new THREE.SphereGeometry(1.5, 64, 64);
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

      animationProgress = 0;
    }

    // Auto-morph every 5 seconds
    const morphInterval = setInterval(() => {
      currentShapeIndex = (currentShapeIndex + 1) % shapes.length;
      morphToShape(shapes[currentShapeIndex]);
    }, 5000);

    // Animation
    const clock = new THREE.Clock();

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Rotation
      particleSystem.rotation.y += delta * 0.1;

      // Morphing animation
      if (animationProgress < 1) {
        animationProgress += delta / animationDuration;
        animationProgress = Math.min(animationProgress, 1);

        const positionsArray = particleSystem.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < numParticles * 3; i++) {
          positionsArray[i] += (targetPositions[i] - positionsArray[i]) * (delta / animationDuration);
        }
        particleSystem.geometry.attributes.position.needsUpdate = true;
      }

      controls.update();
      composer.render();
    };
    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(morphInterval);
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
      className={`fixed inset-0 -z-10 ${className}`}
      style={{ background: '#050508' }}
    />
  );
}

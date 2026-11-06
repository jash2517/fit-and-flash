'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Product, FitDimensions, FitCalculationResult } from '@/types';
import { Rotate3d, Eye, ShieldCheck, Zap } from 'lucide-react';

interface FitStudioCanvasProps {
  product: Product;
  selectedSize: string;
  dimensions: FitDimensions;
  fitResult: FitCalculationResult;
}

export default function FitStudioCanvas({
  product,
  selectedSize,
  dimensions,
  fitResult,
}: FitStudioCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const meshRefs = useRef<THREE.Mesh[]>([]);

  const [isRotating, setIsRotating] = useState(true);
  const [wireframeMode, setWireframeMode] = useState(true);
  const [heatMapIntensity, setHeatMapIntensity] = useState(1);

  // Mouse drag rotation state
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 450;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.2);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    // Clear old canvases if any
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xccff00, 2.0); // Neon acid green light
    dirLight1.position.set(3, 4, 3);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xff4d00, 1.5); // Cyber orange rim light
    dirLight2.position.set(-3, -2, -3);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xffffff, 1.2, 10);
    pointLight.position.set(0, 0, 3);
    scene.add(pointLight);

    // 5. Build 3D Model based on product modelType
    const modelGroup = new THREE.Group();
    modelGroupRef.current = modelGroup;
    scene.add(modelGroup);

    meshRefs.current = [];

    // Helper to determine base color by tension verdict
    let tensionHex = 0xccff00; // ideal green
    if (fitResult.verdict === 'tight') tensionHex = 0xff3b30; // tension red
    if (fitResult.verdict === 'relaxed') tensionHex = 0x0a84ff; // relaxed blue

    if (product.modelType === 'sneaker') {
      // Build Sneaker 3D Geometry
      // Sole
      const soleGeo = new THREE.BoxGeometry(2.4, 0.4, 1.0, 12, 4, 8);
      const soleMat = new THREE.MeshStandardMaterial({
        color: 0x181818,
        wireframe: true,
        roughness: 0.2,
        metalness: 0.8,
      });
      const soleMesh = new THREE.Mesh(soleGeo, soleMat);
      soleMesh.position.set(0, -0.6, 0);
      modelGroup.add(soleMesh);
      meshRefs.current.push(soleMesh);

      // Upper
      const upperGeo = new THREE.CylinderGeometry(0.5, 0.8, 1.1, 16, 12, true);
      upperGeo.rotateZ(Math.PI / 2);
      upperGeo.scale(1.2, 0.8, 1);
      const upperMat = new THREE.MeshStandardMaterial({
        color: tensionHex,
        wireframe: true,
        emissive: tensionHex,
        emissiveIntensity: 0.35,
      });
      const upperMesh = new THREE.Mesh(upperGeo, upperMat);
      upperMesh.position.set(-0.1, -0.1, 0);
      modelGroup.add(upperMesh);
      meshRefs.current.push(upperMesh);

      // Sneaker collar
      const collarGeo = new THREE.TorusGeometry(0.45, 0.12, 12, 24);
      collarGeo.rotateX(Math.PI / 2);
      const collarMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        wireframe: true,
      });
      const collarMesh = new THREE.Mesh(collarGeo, collarMat);
      collarMesh.position.set(0.3, 0.4, 0);
      modelGroup.add(collarMesh);
      meshRefs.current.push(collarMesh);
    } else if (product.modelType === 'denim') {
      // Build Pants / Denim 3D Geometry
      // Left leg
      const legGeo1 = new THREE.CylinderGeometry(0.32, 0.38, 2.4, 16, 20);
      const legMat1 = new THREE.MeshStandardMaterial({
        color: tensionHex,
        wireframe: true,
        emissive: tensionHex,
        emissiveIntensity: 0.3,
      });
      const leg1 = new THREE.Mesh(legGeo1, legMat1);
      leg1.position.set(-0.42, -0.5, 0);
      modelGroup.add(leg1);
      meshRefs.current.push(leg1);

      // Right leg
      const legGeo2 = new THREE.CylinderGeometry(0.32, 0.38, 2.4, 16, 20);
      const leg2 = new THREE.Mesh(legGeo2, legMat1);
      leg2.position.set(0.42, -0.5, 0);
      modelGroup.add(leg2);
      meshRefs.current.push(leg2);

      // Waist / Hips
      const waistGeo = new THREE.CylinderGeometry(0.85, 0.8, 0.8, 20, 8);
      const waistMesh = new THREE.Mesh(waistGeo, legMat1);
      waistMesh.position.set(0, 0.8, 0);
      modelGroup.add(waistMesh);
      meshRefs.current.push(waistMesh);
    } else {
      // Apparel / T-Shirt / Hoodie 3D Geometry
      // Torso / Chest
      const chestGeo = new THREE.CylinderGeometry(0.9, 0.75, 1.8, 24, 20);
      const chestMat = new THREE.MeshStandardMaterial({
        color: tensionHex,
        wireframe: true,
        emissive: tensionHex,
        emissiveIntensity: 0.35,
      });
      const chestMesh = new THREE.Mesh(chestGeo, chestMat);
      chestMesh.position.set(0, 0.1, 0);
      modelGroup.add(chestMesh);
      meshRefs.current.push(chestMesh);

      // Shoulders / Left arm
      const armGeo1 = new THREE.CylinderGeometry(0.28, 0.22, 1.1, 14, 10);
      armGeo1.rotateZ(Math.PI / 4);
      const arm1 = new THREE.Mesh(armGeo1, chestMat);
      arm1.position.set(-1.05, 0.65, 0);
      modelGroup.add(arm1);
      meshRefs.current.push(arm1);

      // Shoulders / Right arm
      const armGeo2 = new THREE.CylinderGeometry(0.28, 0.22, 1.1, 14, 10);
      armGeo2.rotateZ(-Math.PI / 4);
      const arm2 = new THREE.Mesh(armGeo2, chestMat);
      arm2.position.set(1.05, 0.65, 0);
      modelGroup.add(arm2);
      meshRefs.current.push(arm2);

      // Collar / Neck
      const neckGeo = new THREE.TorusGeometry(0.38, 0.08, 12, 28);
      neckGeo.rotateX(Math.PI / 2);
      const neckMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        wireframe: true,
      });
      const neckMesh = new THREE.Mesh(neckGeo, neckMat);
      neckMesh.position.set(0, 1.05, 0);
      modelGroup.add(neckMesh);
      meshRefs.current.push(neckMesh);
    }

    // 6. Animation loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (modelGroupRef.current) {
        if (isRotating && !isDraggingRef.current) {
          modelGroupRef.current.rotation.y += delta * 0.75;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 7. Mouse drag orbit handlers
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !modelGroupRef.current) return;
      const deltaX = e.clientX - prevMouseRef.current.x;
      const deltaY = e.clientY - prevMouseRef.current.y;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };

      modelGroupRef.current.rotation.y += deltaX * 0.01;
      modelGroupRef.current.rotation.x += deltaY * 0.007;
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    // Touch handlers for mobile
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || !modelGroupRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouseRef.current.x;
      const deltaY = e.touches[0].clientY - prevMouseRef.current.y;
      prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

      modelGroupRef.current.rotation.y += deltaX * 0.012;
      modelGroupRef.current.rotation.x += deltaY * 0.008;
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    domEl.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domEl.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domEl.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);

      if (container.contains(domEl)) {
        container.removeChild(domEl);
      }
      renderer.dispose();
    };
  }, [product.modelType]);

  // Update mesh scale & tension colors dynamically when dimensions, size, or fitResult change!
  useEffect(() => {
    if (!modelGroupRef.current) return;

    // Morph dimensions
    if (product.modelType === 'sneaker') {
      const lengthRatio = (dimensions.footLength || 27.5) / 27.5;
      const widthRatio = (dimensions.footWidth || 10.2) / 10.2;
      modelGroupRef.current.scale.set(lengthRatio * 1.2, 1, widthRatio * 1.1);
    } else if (product.modelType === 'denim') {
      const waistRatio = dimensions.waist / 82;
      const heightRatio = dimensions.height / 182;
      modelGroupRef.current.scale.set(waistRatio * 1.1, heightRatio, waistRatio * 1.05);
    } else {
      const chestRatio = dimensions.chest / 104;
      const waistRatio = dimensions.waist / 82;
      const heightRatio = dimensions.height / 182;
      modelGroupRef.current.scale.set(chestRatio * 1.1, heightRatio * 1.05, waistRatio * 1.08);
    }

    // Morph colors based on tension verdict
    let targetHex = 0xccff00; // ideal neon green
    if (fitResult.verdict === 'tight') targetHex = 0xff3b30; // red
    if (fitResult.verdict === 'relaxed') targetHex = 0x0a84ff; // blue

    meshRefs.current.forEach((mesh) => {
      if (mesh.material instanceof THREE.MeshStandardMaterial) {
        mesh.material.color.setHex(targetHex);
        mesh.material.emissive.setHex(targetHex);
        mesh.material.wireframe = wireframeMode;
      }
    });
  }, [dimensions, fitResult, selectedSize, wireframeMode, product.modelType]);

  return (
    <div className="relative w-full h-[440px] md:h-[480px] rounded-2xl overflow-hidden bg-black/80 border border-white/10 shadow-2xl flex items-center justify-center select-none">
      {/* 3D Canvas Mount Point */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Cyberpunk HUD Grid Overlays */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none flex flex-col gap-1.5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider liquid-glass border-neonAcid/30 text-neonAcid">
          <span className="w-2 h-2 rounded-full bg-neonAcid animate-ping" />
          VOLUMETRIC FIT ENGINE v3.4
        </div>
        <div className="text-[12px] font-mono text-zinc-400">
          MESH_POLYS: 1,420 • VERTEX_SYNC: ACTIVE
        </div>
      </div>

      {/* Tension Zone Legend */}
      <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-1.5 pointer-events-none">
        <div className="liquid-glass px-3 py-2 rounded-xl flex flex-col gap-1 text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF3B30] inline-block" />
            <span className={fitResult.verdict === 'tight' ? 'text-white font-bold' : 'text-zinc-400'}>
              TIGHT (&gt; 15% Strain)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#CCFF00] inline-block" />
            <span className={fitResult.verdict === 'ideal' ? 'text-neonAcid font-bold' : 'text-zinc-400'}>
              IDEAL (0–5% Strain)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0A84FF] inline-block" />
            <span className={fitResult.verdict === 'relaxed' ? 'text-blue-400 font-bold' : 'text-zinc-400'}>
              RELAXED / OVERSIZED
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Controls Overlay */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsRotating(!isRotating)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-all ${
              isRotating
                ? 'bg-neonAcid text-black shadow-lg shadow-neonAcid/20'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Rotate3d className="w-3.5 h-3.5" />
            {isRotating ? 'AUTO-ORBIT: ON' : 'AUTO-ORBIT: OFF'}
          </button>
          <button
            type="button"
            onClick={() => setWireframeMode(!wireframeMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-all ${
              wireframeMode
                ? 'bg-white/20 text-white'
                : 'bg-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            {wireframeMode ? 'WIREFRAME TENSION' : 'SOLID SHADED'}
          </button>
        </div>

        {/* Live Tension Match Score Pill */}
        <div
          className={`px-4 py-1.5 rounded-full font-mono text-xs font-bold tracking-wide flex items-center gap-2 border shadow-lg ${
            fitResult.verdict === 'ideal'
              ? 'bg-[#CCFF00]/10 border-neonAcid text-neonAcid'
              : fitResult.verdict === 'tight'
              ? 'bg-red-500/10 border-red-500 text-red-400'
              : 'bg-blue-500/10 border-blue-500 text-blue-400'
          }`}
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>{fitResult.verdictText}</span>
        </div>
      </div>

      {/* Watermark instruction */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 pointer-events-none text-[11px] font-mono text-zinc-500/80">
        [ DRAG TO ROTATE 360° • PINCH / SCROLL TO EXAMINE SEAMS ]
      </div>
    </div>
  );
}


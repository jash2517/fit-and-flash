'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

/**
 * ============================================================================
 * HERO GRID CONFIGURATION
 * ----------------------------------------------------------------------------
 * Tweak any visual parameter here without modifying shader or Three.js code.
 * ============================================================================
 */
export const HERO_GRID_CONFIG = {
  // --- Palette & Visuals ---
  gridColor: '#1AA3FF',       // Electric neon blue grid lines
  accentColor: '#FF7A1A',     // Brand orange for liquid bump & sunset interaction
  skyColor: '#000000',        // Pure retro black space above the horizon
  floorFadeColor: '#000000',  // Fog fade color at horizon and camera near-plane

  // Sunset Glow at Horizon (Sun semicircle / orb)
  sunColors: {
    core: '#FFA04D',          // Bright incandescent orange core
    mid: '#FF5500',           // Saturated brand sunset orange
    rim: '#B81473',           // Magenta edge transition
    haze: '#FF7A1A',          // Atmospheric haze band blending into the grid
  },

  // --- Grid Motion & Sizing ---
  scrollSpeed: 0.60,          // Forward scrolling speed in units/sec (calm & steady)
  gridCellSize: 1.0,          // Spacing between grid lines (world units)
  lineWidth: 0.035,           // Crisp line core thickness
  glowWidth: 0.16,            // Bloom-like soft glow spread around grid lines

  // --- Pointer Liquid Displacement (Gaussian Bump) ---
  bendRadius: 2.5,            // Spread radius of the liquid deformation (world units)
  bendStrength: 0.65,         // Vertical displacement height amplitude
  bendLerp: 0.08,             // Fluid easing factor per frame (0.05 = heavy liquid, 0.15 = snappy)
  cameraParallaxMaxDeg: 1.8,  // Subtle camera tilt with pointer (+/- degrees)

  // --- Atmospheric Particles ---
  particleCount: 80,          // Subtle drifting dust motes
  particleSpeed: 0.22,        // Upward float velocity
  particleSize: 2.4,          // Screen point size

  // --- Optimization & Responsive ---
  desktopSegments: 120,       // Plane subdivision on desktop (120x120 vertices)
  mobileSegments: 60,         // Reduced subdivision on mobile (<768px)
};

interface HeroGridBackgroundProps {
  scrollY?: number;
  pointerPos?: { x: number; y: number; isInside: boolean }; // Normalized -1 to +1
}

export default function HeroGridBackground({
  scrollY = 0,
  pointerPos = { x: 0, y: 0, isInside: false },
}: HeroGridBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  // References to pass state into the animation loop without re-instantiating Three.js
  const scrollRef = useRef(scrollY);
  const pointerRef = useRef(pointerPos);

  useEffect(() => {
    scrollRef.current = scrollY;
  }, [scrollY]);

  useEffect(() => {
    pointerRef.current = pointerPos;
  }, [pointerPos]);

  useEffect(() => {
    // 1. Accessibility: prefers-reduced-motion check
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', handleMotionChange);

    // 2. WebGL capability check
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        return () => motionQuery.removeEventListener('change', handleMotionChange);
      }
    } catch {
      setHasWebGL(false);
      return () => motionQuery.removeEventListener('change', handleMotionChange);
    }

    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const isMobile = width < 768;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(HERO_GRID_CONFIG.skyColor);

    // Camera: Low-angle perspective looking slightly down-range so horizon sits at ~56% of viewport height
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 80);
    camera.position.set(0, 1.45, 5.0);
    camera.lookAt(0, 0.85, -14.0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: false,
      alpha: false,
      stencil: false,
      depth: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.pointerEvents = 'none';
    renderer.domElement.setAttribute('aria-hidden', 'true');
    container.appendChild(renderer.domElement);

    // --- 3D Grid Floor Geometry & Custom Shader ---
    const segments = isMobile ? HERO_GRID_CONFIG.mobileSegments : HERO_GRID_CONFIG.desktopSegments;
    const planeWidth = 50;
    const planeDepth = 60;
    const gridGeometry = new THREE.PlaneGeometry(planeWidth, planeDepth, segments, segments);
    gridGeometry.rotateX(-Math.PI / 2);
    // Position floor so it extends from in front of the camera back to the horizon
    gridGeometry.translate(0, 0, -planeDepth * 0.35);

    // Color instances for shader uniforms
    const gridColorVec = new THREE.Color(HERO_GRID_CONFIG.gridColor);
    const accentColorVec = new THREE.Color(HERO_GRID_CONFIG.accentColor);
    const fadeColorVec = new THREE.Color(HERO_GRID_CONFIG.floorFadeColor);

    /**
     * GLSL VERTEX SHADER
     * - Displaces plane Y according to Gaussian distance from liquid pointer position
     * - Passes distance & bump amplitude to fragment shader for line brightening
     */
    const vertexShader = `
      uniform float uTime;
      uniform vec3 uMouse;
      uniform float uBendRadius;
      uniform float uBendStrength;
      uniform float uStrength;
      uniform float uIsMobile;

      varying vec3 vWorldPosition;
      varying float vBump;
      varying float vDistanceToCamera;

      void main() {
        vec3 pos = position;

        // Interactive pointer displacement (Gaussian liquid bump)
        float distToMouse = length(pos.xz - uMouse.xz);
        float gaussian = exp(- (distToMouse * distToMouse) / (2.0 * uBendRadius * uBendRadius));

        // On mobile or idle, add a very gentle automatic subtle ambient swell
        float ambientWave = sin(pos.z * 0.4 - uTime * 1.5) * cos(pos.x * 0.3) * 0.08;

        // Total vertical displacement
        float bumpHeight = gaussian * uBendStrength * uStrength;
        pos.y += bumpHeight + ambientWave;

        vBump = gaussian * uStrength;

        vec4 worldPos = modelMatrix * vec4(pos, 1.0);
        vWorldPosition = worldPos.xyz;
        vDistanceToCamera = length(worldPos.xyz - cameraPosition);

        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `;

    /**
     * GLSL FRAGMENT SHADER
     * - Generates clean infinite dual-lobe grid lines (core + soft bloom glow) via fract()/smoothstep
     * - Modulo time scrolling for 100% seamless infinite forward motion
     * - Smooth distance fog fading to black at the horizon and near-camera clip
     * - Color shifts from electric blue to warm orange at the interactive liquid bump
     */
    const fragmentShader = `
      uniform float uTime;
      uniform float uSpeed;
      uniform float uCellSize;
      uniform float uLineWidth;
      uniform float uGlowWidth;
      uniform vec3 uGridColor;
      uniform vec3 uAccentColor;
      uniform vec3 uFadeColor;

      varying vec3 vWorldPosition;
      varying float vBump;
      varying float vDistanceToCamera;

      void main() {
        // Continuous seamless scrolling coordinate: z advances forward with time
        vec2 coord = vec2(vWorldPosition.x, vWorldPosition.z + uTime * uSpeed);

        // Grid lines via fract centered at 0.5
        vec2 grid = abs(fract(coord / uCellSize - 0.5) - 0.5) / fwidth(coord / uCellSize);
        float lineDist = min(grid.x, grid.y);

        // Core thin line (crisp electric blue)
        float lineCore = 1.0 - smoothstep(0.0, 1.2, lineDist);

        // Bloom-like soft outer glow (wider spread)
        vec2 softGrid = abs(fract(coord / uCellSize - 0.5) - 0.5);
        float softDist = min(softGrid.x, softGrid.y);
        float lineGlow = 1.0 - smoothstep(0.0, uGlowWidth, softDist);

        // Combined line intensity
        float totalLine = clamp(lineCore * 1.4 + lineGlow * 0.5, 0.0, 1.8);

        // Color modulation: shifts toward brand orange near the cursor liquid bump
        vec3 dynamicColor = mix(uGridColor, uAccentColor, clamp(vBump * 1.3, 0.0, 1.0));

        // Atmospheric distance fog:
        // Fades seamlessly into deep black toward the horizon (z < -24.0)
        // and softly fades out right in front of the camera to avoid harsh near-plane clipping
        float farFog = smoothstep(-2.0, -28.0, vWorldPosition.z);
        float nearFog = smoothstep(4.0, 0.5, vWorldPosition.z);
        float fogFactor = clamp(farFog * nearFog, 0.0, 1.0);

        vec3 finalColor = dynamicColor * totalLine;

        // Blend with horizon background fog
        finalColor = mix(uFadeColor, finalColor, fogFactor);

        gl_FragColor = vec4(finalColor, fogFactor * totalLine);
      }
    `;

    const gridMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: HERO_GRID_CONFIG.scrollSpeed },
        uCellSize: { value: HERO_GRID_CONFIG.gridCellSize },
        uLineWidth: { value: HERO_GRID_CONFIG.lineWidth },
        uGlowWidth: { value: HERO_GRID_CONFIG.glowWidth },
        uGridColor: { value: gridColorVec },
        uAccentColor: { value: accentColorVec },
        uFadeColor: { value: fadeColorVec },
        uMouse: { value: new THREE.Vector3(0, 0, -10) },
        uBendRadius: { value: HERO_GRID_CONFIG.bendRadius },
        uBendStrength: { value: HERO_GRID_CONFIG.bendStrength },
        uStrength: { value: 0 },
        uIsMobile: { value: isMobile ? 1.0 : 0.0 },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const gridMesh = new THREE.Mesh(gridGeometry, gridMaterial);
    scene.add(gridMesh);

    // --- Horizon Sunset Glow (Sun Orb & Atmospheric Haze Band) ---
    // A billboard mesh positioned at the horizon plane behind the mascot
    const sunGeometry = new THREE.PlaneGeometry(28, 14);
    const sunMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uScrollFade;
        varying vec2 vUv;

        void main() {
          // Centered coordinate system where y=0 is the horizon floor
          vec2 p = vUv * 2.0 - 1.0;
          p.y += 0.35; // Position base at the horizon

          // Subtle 6-second breathing pulse (scale 1.0 -> 1.04)
          float pulse = 1.0 + 0.038 * 0.5 * (1.0 + sin(uTime * (2.0 * 3.14159265 / 6.0)));
          float r = length(p * vec2(1.0, 1.45) / pulse);

          // Radial gradient: Core (#FFA04D) -> Mid (#FF5500) -> Rim (#B81473) -> Transparent
          vec3 cCore = vec3(1.0, 0.627, 0.302);
          vec3 cMid  = vec3(1.0, 0.333, 0.0);
          vec3 cRim  = vec3(0.722, 0.078, 0.451);

          float t1 = smoothstep(0.0, 0.42, r);
          float t2 = smoothstep(0.42, 0.85, r);
          vec3 color = mix(cCore, cMid, t1);
          color = mix(color, cRim, t2);

          // Alpha falloff
          float alpha = 1.0 - smoothstep(0.08, 0.92, r);
          alpha = pow(alpha, 1.8) * 0.82;

          // Horizontal horizon haze band: soft atmospheric strip right at the horizon
          float haze = (1.0 - smoothstep(0.0, 0.25, abs(p.y))) * (1.0 - smoothstep(0.0, 1.2, abs(p.x)));
          color += vec3(1.0, 0.48, 0.1) * haze * 0.45;
          alpha += haze * 0.35;

          // Fade out as user scrolls past the hero
          alpha *= clamp(uScrollFade, 0.0, 1.0);

          gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uScrollFade: { value: 1.0 },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    sunMesh.position.set(0, 1.6, -26.0);
    scene.add(sunMesh);

    // --- Atmospheric Dust Particles (Motes drifting upward) ---
    let particlesMesh: THREE.Points | null = null;
    let particlePositions: Float32Array | null = null;
    const particleCount = isMobile ? 0 : HERO_GRID_CONFIG.particleCount;

    if (particleCount > 0) {
      const pGeometry = new THREE.BufferGeometry();
      particlePositions = new Float32Array(particleCount * 3);
      const particleColors = new Float32Array(particleCount * 3);
      const particlePhases = new Float32Array(particleCount);

      const colorBlue = new THREE.Color(HERO_GRID_CONFIG.gridColor);
      const colorOrange = new THREE.Color(HERO_GRID_CONFIG.accentColor);

      for (let i = 0; i < particleCount; i++) {
        // Spread particles across the visible floor cone
        particlePositions[i * 3 + 0] = (Math.random() - 0.5) * 22;
        particlePositions[i * 3 + 1] = Math.random() * 4.5 + 0.1;
        particlePositions[i * 3 + 2] = -Math.random() * 24;

        // Alternate or mix colors between electric blue and brand orange
        const isOrange = Math.random() > 0.55;
        const col = isOrange ? colorOrange : colorBlue;
        particleColors[i * 3 + 0] = col.r;
        particleColors[i * 3 + 1] = col.g;
        particleColors[i * 3 + 2] = col.b;

        particlePhases[i] = Math.random() * Math.PI * 2;
      }

      pGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
      pGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

      const pMaterial = new THREE.ShaderMaterial({
        vertexShader: `
          attribute vec3 color;
          varying vec3 vColor;
          varying float vDist;
          uniform float uSize;

          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vDist = -mvPosition.z;
            gl_PointSize = uSize * (14.0 / max(-mvPosition.z, 1.0));
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vDist;

          void main() {
            // Circular point sprite with soft radial falloff
            float d = length(gl_PointCoord - vec2(0.5));
            if (d > 0.5) discard;
            float alpha = smoothstep(0.5, 0.05, d) * 0.65;
            gl_FragColor = vec4(vColor, alpha);
          }
        `,
        uniforms: {
          uSize: { value: HERO_GRID_CONFIG.particleSize },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      particlesMesh = new THREE.Points(pGeometry, pMaterial);
      scene.add(particlesMesh);
    }

    // --- Pointer Raycasting to Floor Plane ---
    const raycaster = new THREE.Raycaster();
    const floorMathPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const targetMouseWorld = new THREE.Vector3(0, 0, -10);
    const currentMouseWorld = new THREE.Vector3(0, 0, -10);
    let currentStrength = 0;
    const targetCameraRotation = new THREE.Euler(0, 0, 0);

    // --- Animation & Render Loop ---
    let animationFrameId: number;
    let lastTime = performance.now();
    let totalTime = 0;
    let isVisible = true;

    // IntersectionObserver to pause loop when hero is offscreen
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    // Tab visibility handling
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Handle prefers-reduced-motion: render static frame
      if (prefersReducedMotion) {
        renderer.render(scene, camera);
        return;
      }

      // Scroll factor: scrolling past the hero increases grid speed up to 3x and fades sunset
      const scrollYVal = scrollRef.current;
      const scrollPastProgress = Math.min(Math.max(scrollYVal / 450, 0), 1);
      const dynamicSpeed = HERO_GRID_CONFIG.scrollSpeed * (1.0 + 2.0 * scrollPastProgress);
      const sunFade = Math.max(0, 1.0 - scrollPastProgress * 1.25);

      totalTime += delta;

      // Update shader uniforms
      gridMaterial.uniforms.uTime.value = totalTime;
      gridMaterial.uniforms.uSpeed.value = dynamicSpeed;
      sunMaterial.uniforms.uTime.value = totalTime;
      sunMaterial.uniforms.uScrollFade.value = sunFade;

      // Pointer raycasting & fluid gaussian easing
      const pointerData = pointerRef.current;
      const targetStrength = pointerData.isInside ? 1.0 : 0.0;
      currentStrength += (targetStrength - currentStrength) * HERO_GRID_CONFIG.bendLerp;

      if (pointerData.isInside) {
        // Raycast against ground plane
        raycaster.setFromCamera(
          new THREE.Vector2(pointerData.x, pointerData.y),
          camera
        );
        const intersectPoint = new THREE.Vector3();
        if (raycaster.ray.intersectPlane(floorMathPlane, intersectPoint)) {
          // Clamp target to floor bounds
          intersectPoint.x = Math.max(-18, Math.min(18, intersectPoint.x));
          intersectPoint.z = Math.max(-28, Math.min(2, intersectPoint.z));
          targetMouseWorld.copy(intersectPoint);
        }
      }

      // Fluid interpolation for liquid feel
      currentMouseWorld.lerp(targetMouseWorld, HERO_GRID_CONFIG.bendLerp);
      gridMaterial.uniforms.uMouse.value.copy(currentMouseWorld);
      gridMaterial.uniforms.uStrength.value = currentStrength;

      // Subtle camera parallax tied to pointer (max +/- 1.8 degrees)
      if (!isMobile) {
        const maxRad = THREE.MathUtils.degToRad(HERO_GRID_CONFIG.cameraParallaxMaxDeg);
        targetCameraRotation.y = -pointerData.x * maxRad;
        targetCameraRotation.x = -0.04 + pointerData.y * maxRad * 0.6;
        camera.rotation.y += (targetCameraRotation.y - camera.rotation.y) * 0.05;
        camera.rotation.x += (targetCameraRotation.x - camera.rotation.x) * 0.05;
      }

      // Animate drifting dust particles
      if (particlesMesh && particlePositions) {
        const posAttr = particlesMesh.geometry.attributes.position;
        const positions = posAttr.array as Float32Array;

        for (let i = 0; i < particleCount; i++) {
          // Drift upward
          positions[i * 3 + 1] += HERO_GRID_CONFIG.particleSpeed * delta;
          // Gentle horizontal sway
          positions[i * 3 + 0] += Math.sin(totalTime * 0.8 + i) * 0.003;

          // Wrap around once particles float above horizon ceiling
          if (positions[i * 3 + 1] > 4.8) {
            positions[i * 3 + 1] = 0.1;
            positions[i * 3 + 0] = (Math.random() - 0.5) * 22;
          }
        }
        posAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // --- Resize Handling with ResizeObserver ---
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || window.innerWidth;
      const newH = container.clientHeight || window.innerHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // --- Cleanup & Resource Disposal ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      motionQuery.removeEventListener('change', handleMotionChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();

      gridGeometry.dispose();
      gridMaterial.dispose();
      sunGeometry.dispose();
      sunMaterial.dispose();
      if (particlesMesh) {
        particlesMesh.geometry.dispose();
        (particlesMesh.material as THREE.Material).dispose();
      }
      renderer.dispose();

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [hasWebGL, prefersReducedMotion]);

  // --- Fallback for Browsers Without WebGL ---
  if (!hasWebGL) {
    return (
      <div
        className="absolute inset-0 w-full h-full overflow-hidden bg-black select-none pointer-events-none"
        aria-hidden="true"
      >
        {/* CSS Sunset Glow Fallback */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-[40%] w-[520px] h-[300px] rounded-full blur-[70px] opacity-80"
          style={{
            background: `radial-gradient(circle, ${HERO_GRID_CONFIG.sunColors.core} 0%, ${HERO_GRID_CONFIG.sunColors.mid} 40%, ${HERO_GRID_CONFIG.sunColors.rim} 75%, transparent 100%)`,
          }}
        />
        {/* CSS Horizon Haze */}
        <div className="absolute inset-x-0 bottom-[44%] h-12 bg-gradient-to-t from-transparent via-[#FF7A1A]/30 to-transparent blur-sm" />
        {/* Perspective CSS Grid Floor */}
        <div
          className="absolute inset-x-0 bottom-0 h-[56%] origin-bottom"
          style={{
            transform: 'perspective(320px) rotateX(68deg)',
            backgroundImage: `
              linear-gradient(to right, rgba(26,163,255,0.4) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(26,163,255,0.4) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 95%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 95%)',
          }}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none z-0"
      aria-hidden="true"
    >
      {/* Subtle 4% Film Grain Overlay for retro-futuristic texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] z-10 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}


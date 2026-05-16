import { component$, useVisibleTask$, useSignal } from '@builder.io/qwik';
import * as THREE from 'three';

export const ThreeBackground = component$(() => {
  const containerRef = useSignal<HTMLDivElement>();

  useVisibleTask$(({ cleanup }) => {
    if (!containerRef.value) return;

    // --- CONFIGURATION ---
    const particleCount = 60;
    const gridSize = 0.8;
    const cameraZ = 8;
    const fov = 75;
    const planeSize = 60;
    const planeSegments = 160;
    const baseGridOpacity = 0.3;
    const glowRadius = 3.0;
    const wellRadius = 2.0;
    const wellDepth = 0.5;
    const minSpeed = 0.008;
    const maxSpeed = 0.025;
    const particleOpacity = 0.8;
    const trailOpacity = 0.7;
    const trailSegments = 4;

    // --- STATE ---
    const mouseVector = new THREE.Vector2(-100, -100);
    const mouseWorld = new THREE.Vector3(1000, 1000, 0);
    const targetMouseWorld = new THREE.Vector3(1000, 1000, 0);
    let mouseActive = false;
    let activeFactor = 0;

    // 1. Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      fov,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.value.appendChild(renderer.domElement);
    camera.position.z = cameraZ;

    const computeBounds = () => {
      const halfHeight = cameraZ * Math.tan((fov * Math.PI) / 360);
      const halfWidth = halfHeight * (window.innerWidth / window.innerHeight);
      return Math.max(halfWidth, halfHeight) + 1;
    };
    let bounds = computeBounds();

    const raycaster = new THREE.Raycaster();
    const mathPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    // 2. Warping grid plane — visible at base opacity, brightens near cursor
    const gridGeometry = new THREE.PlaneGeometry(planeSize, planeSize, planeSegments, planeSegments);
    const gridMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uMouse: { value: new THREE.Vector3(1000, 1000, 0) },
        uMouseActive: { value: 0.0 },
        uGlowRadius: { value: glowRadius },
        uWellRadius: { value: wellRadius },
        uWellDepth: { value: wellDepth },
        uGridSize: { value: gridSize },
        uBaseOpacity: { value: baseGridOpacity },
        uColor: { value: new THREE.Color(0x4a8a7a) },
        uGlowColor: { value: new THREE.Color(0x9af5e0) },
      },
      vertexShader: /* glsl */ `
        uniform vec3 uMouse;
        uniform float uWellRadius;
        uniform float uWellDepth;
        uniform float uMouseActive;
        varying vec3 vWorldPos;

        void main() {
          vec3 pos = position;
          vec2 toMouse = uMouse.xy - pos.xy;
          float distSq = dot(toMouse, toMouse);
          float r2 = uWellRadius * uWellRadius * 0.35;
          float wellInfluence = exp(-distSq / r2) * uMouseActive;
          pos.z -= wellInfluence * uWellDepth;
          vWorldPos = pos;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uMouse;
        uniform float uMouseActive;
        uniform float uGlowRadius;
        uniform float uGridSize;
        uniform float uBaseOpacity;
        uniform vec3 uColor;
        uniform vec3 uGlowColor;
        varying vec3 vWorldPos;

        void main() {
          vec2 coord = vWorldPos.xy / uGridSize;
          vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
          float line = min(grid.x, grid.y);
          float gridMask = 1.0 - min(line, 1.0);
          if (gridMask < 0.01) discard;

          float distToMouse = distance(vWorldPos.xy, uMouse.xy);
          float glow = 1.0 - smoothstep(0.0, uGlowRadius, distToMouse);
          glow = glow * glow * uMouseActive;

          float intensity = gridMask * (uBaseOpacity + glow * 0.9);
          vec3 color = mix(uColor, uGlowColor, glow);

          gl_FragColor = vec4(color, intensity);
        }
      `,
      transparent: true,
      depthWrite: false,
    });
    const gridMesh = new THREE.Mesh(gridGeometry, gridMaterial);
    scene.add(gridMesh);

    // 3. Particles — strictly travel along one grid axis at constant velocity
    type ParticleData = {
      axis: 0 | 1; // 0 = X, 1 = Y
      speed: number; // signed magnitude along the axis
      trailLen: number;
    };
    const particlesData: ParticleData[] = [];
    const positions = new Float32Array(particleCount * 3);
    const geometry = new THREE.BufferGeometry();

    for (let i = 0; i < particleCount; i++) {
      const axis: 0 | 1 = Math.random() > 0.5 ? 0 : 1;
      const dir = Math.random() > 0.5 ? 1 : -1;
      const speedMag = minSpeed + Math.random() * (maxSpeed - minSpeed);
      const speed = speedMag * dir;
      const trailLen = 0.5 + speedMag * 50;

      const lane = Math.round(((Math.random() - 0.5) * bounds * 1.9) / gridSize) * gridSize;
      const along = (Math.random() - 0.5) * bounds * 2;

      if (axis === 0) {
        positions[i * 3] = along;
        positions[i * 3 + 1] = lane;
      } else {
        positions[i * 3] = lane;
        positions[i * 3 + 1] = along;
      }
      positions[i * 3 + 2] = 0.02;

      particlesData.push({ axis, speed, trailLen });
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const pMaterial = new THREE.PointsMaterial({
      color: 0xbcffe8,
      size: 0.085,
      transparent: true,
      opacity: particleOpacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particlesMesh = new THREE.Points(geometry, pMaterial);
    scene.add(particlesMesh);

    // 4. Shooting-star trails — subdivided so they curve along the warped grid surface
    const trailVerts = trailSegments * 2; // LineSegments: 2 verts per segment
    const trailPositions = new Float32Array(particleCount * trailVerts * 3);
    const trailAlphas = new Float32Array(particleCount * trailVerts);
    for (let i = 0; i < particleCount; i++) {
      for (let s = 0; s < trailSegments; s++) {
        const a0 = 1 - s / trailSegments;
        const a1 = 1 - (s + 1) / trailSegments;
        trailAlphas[i * trailVerts + s * 2] = a0;
        trailAlphas[i * trailVerts + s * 2 + 1] = a1;
      }
    }
    const trailGeometry = new THREE.BufferGeometry();
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    trailGeometry.setAttribute('aAlpha', new THREE.BufferAttribute(trailAlphas, 1));

    const trailMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(0x9af5e0) },
        uIntensity: { value: trailOpacity },
      },
      vertexShader: /* glsl */ `
        attribute float aAlpha;
        varying float vAlpha;
        void main() {
          vAlpha = aAlpha;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        uniform float uIntensity;
        varying float vAlpha;
        void main() {
          float a = pow(vAlpha, 2.0) * uIntensity;
          gl_FragColor = vec4(uColor, a);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const trailMesh = new THREE.LineSegments(trailGeometry, trailMaterial);
    scene.add(trailMesh);

    // 5. Mouse
    const onMouseMove = (event: MouseEvent) => {
      mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;
      mouseActive = true;
    };
    const onMouseLeave = () => {
      mouseActive = false;
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    // 6. Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      raycaster.setFromCamera(mouseVector, camera);
      const hit = raycaster.ray.intersectPlane(mathPlane, targetMouseWorld);
      if (!hit) targetMouseWorld.set(1000, 1000, 0);
      mouseWorld.lerp(targetMouseWorld, 0.18);

      const target = mouseActive ? 1 : 0;
      activeFactor += (target - activeFactor) * 0.06;
      if (activeFactor < 0.001) activeFactor = 0;

      gridMaterial.uniforms.uMouse.value.copy(mouseWorld);
      gridMaterial.uniforms.uMouseActive.value = activeFactor;

      const wellR2 = wellRadius * wellRadius;
      const wellR2x035 = wellR2 * 0.35;

      // Sample the warped grid surface at any (x,y) — matches the grid vertex shader exactly
      const gridZAt = (px: number, py: number): number => {
        if (activeFactor < 0.005) return 0.02;
        const dx = mouseWorld.x - px;
        const dy = mouseWorld.y - py;
        const dSq = dx * dx + dy * dy;
        return -Math.exp(-dSq / wellR2x035) * wellDepth * activeFactor + 0.02;
      };

      for (let i = 0; i < particleCount; i++) {
        const data = particlesData[i];
        let x = positions[i * 3];
        let y = positions[i * 3 + 1];

        // Travel only along the chosen grid axis
        if (data.axis === 0) x += data.speed;
        else y += data.speed;

        // Wrap at viewport bounds
        if (x < -bounds) x += bounds * 2;
        else if (x > bounds) x -= bounds * 2;
        if (y < -bounds) y += bounds * 2;
        else if (y > bounds) y -= bounds * 2;

        // Particle sits exactly on the warped grid surface — follows the well's physics
        const z = gridZAt(x, y);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // Trail subdivided into segments; each sample finds its own Z on the warped grid
        const dirX = data.axis === 0 ? Math.sign(data.speed) : 0;
        const dirY = data.axis === 1 ? Math.sign(data.speed) : 0;
        const stepLen = data.trailLen / trailSegments;

        for (let s = 0; s < trailSegments; s++) {
          const x0 = x - dirX * stepLen * s;
          const y0 = y - dirY * stepLen * s;
          const x1 = x - dirX * stepLen * (s + 1);
          const y1 = y - dirY * stepLen * (s + 1);
          const base = (i * trailVerts + s * 2) * 3;
          trailPositions[base + 0] = x0;
          trailPositions[base + 1] = y0;
          trailPositions[base + 2] = gridZAt(x0, y0);
          trailPositions[base + 3] = x1;
          trailPositions[base + 4] = y1;
          trailPositions[base + 5] = gridZAt(x1, y1);
        }
      }
      geometry.attributes.position.needsUpdate = true;
      trailGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      bounds = computeBounds();
    };
    window.addEventListener('resize', handleResize);

    cleanup(() => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animationId);
      geometry.dispose();
      pMaterial.dispose();
      gridGeometry.dispose();
      gridMaterial.dispose();
      trailGeometry.dispose();
      trailMaterial.dispose();
      renderer.dispose();
      if (
        containerRef.value &&
        renderer.domElement &&
        containerRef.value.contains(renderer.domElement)
      ) {
        containerRef.value.removeChild(renderer.domElement);
      }
    });
  }, { strategy: 'document-idle' });

  return (
    <div
      ref={containerRef}
      class="fixed top-0 left-0 w-full h-full z-0 pointer-events-none bg-[#050505]"
    />
  );
});

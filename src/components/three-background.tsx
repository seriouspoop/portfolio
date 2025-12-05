import { component$, useVisibleTask$, useSignal } from '@builder.io/qwik';
import * as THREE from 'three';

export const ThreeBackground = component$(() => {
  const containerRef = useSignal<HTMLDivElement>();

  useVisibleTask$(({ cleanup }) => {
    if (!containerRef.value) return;

    // --- CONFIGURATION ---
    const particleCount = 120;
    const connectDistance = 2.5;
    const moveSpeed = 0.008;
    const mouseRepulsionRadius = 3.0; // Increased radius for softer falloff
    const mouseRepulsionForce = 0.001; // significantly reduced force for gentle push

    // --- VARIABLES ---
    let mouseX = 0;
    let mouseY = 0;
    // Normalized mouse coordinates for Raycaster (-1 to 1)
    const mouseVector = new THREE.Vector2(-100, -100);

    // 1. Setup Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.value.appendChild(renderer.domElement);

    // Helpers for interactions
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // Virtual plane at Z=0
    const planeIntersectPoint = new THREE.Vector3();

    // 2. Create Particles
    const particlesData: { velocity: THREE.Vector3, originalVelocity: THREE.Vector3 }[] = [];
    const positions = new Float32Array(particleCount * 3);
    const geometry = new THREE.BufferGeometry();

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 18;
      const y = (Math.random() - 0.5) * 18;
      const z = (Math.random() - 0.5) * 10;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const v = new THREE.Vector3(
        -1 + Math.random() * 2,
        -1 + Math.random() * 2,
        -1 + Math.random() * 2
      ).normalize().multiplyScalar(moveSpeed);

      particlesData.push({
        velocity: v.clone(),
        originalVelocity: v.clone() // Store original to revert after repulsion
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // 3. Materials
    const pMaterial = new THREE.PointsMaterial({
      color: 0x44aa88,
      size: 0.08,
      transparent: true,
      opacity: 0.8,
    });
    const particlesMesh = new THREE.Points(geometry, pMaterial);
    scene.add(particlesMesh);

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x44aa88,
      transparent: true,
      opacity: 0.12,
    });
    const lineGeometry = new THREE.BufferGeometry();
    const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(linesMesh);

    camera.position.z = 5;

    // 4. Mouse Listeners
    const onMouseMove = (event: MouseEvent) => {
      // For Parallax (Screen center is 0,0)
      // Reduced sensitivity from 0.001 to 0.0002 for very subtle movement
      mouseX = (event.clientX - window.innerWidth / 2) * 0.0002;
      mouseY = (event.clientY - window.innerHeight / 2) * 0.0002;

      // For Raycasting (Normalized 0 to 1)
      mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    document.addEventListener('mousemove', onMouseMove);

    // 5. Animation Loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // --- A. Mouse Interaction (Raycasting) ---
      raycaster.setFromCamera(mouseVector, camera);
      raycaster.ray.intersectPlane(plane, planeIntersectPoint);

      // --- B. Update Particles ---
      let vertexIndex = 0;
      for (let i = 0; i < particleCount; i++) {
        const data = particlesData[i];
        let x = positions[vertexIndex];
        let y = positions[vertexIndex + 1];
        let z = positions[vertexIndex + 2];

        // 1. Repulsion Logic
        // Calculate distance from particle to mouse point
        const dx = x - planeIntersectPoint.x;
        const dy = y - planeIntersectPoint.y;
        // Ignore Z for repulsion to make it feel like a cylinder affecting all depths
        const distSq = dx * dx + dy * dy;

        if (distSq < mouseRepulsionRadius * mouseRepulsionRadius) {
          const dist = Math.sqrt(distSq);
          const force = (mouseRepulsionRadius - dist) / mouseRepulsionRadius;

          // Push away
          data.velocity.x += (dx / dist) * force * mouseRepulsionForce;
          data.velocity.y += (dy / dist) * force * mouseRepulsionForce;
        }

        // 2. Apply Velocity
        x += data.velocity.x;
        y += data.velocity.y;
        z += data.velocity.z;

        // 3. Friction (Return to normal speed)
        // Linearly interpolate current velocity back to original velocity
        // Reduced factor (0.05 -> 0.02) means they take longer to slow down = smoother
        data.velocity.x += (data.originalVelocity.x - data.velocity.x) * 0.02;
        data.velocity.y += (data.originalVelocity.y - data.velocity.y) * 0.02;

        // 4. Boundary Bounce
        if (x < -9 || x > 9) data.velocity.x = -data.velocity.x;
        if (y < -9 || y > 9) data.velocity.y = -data.velocity.y;
        if (z < -9 || z > 9) data.velocity.z = -data.velocity.z;

        positions[vertexIndex] = x;
        positions[vertexIndex + 1] = y;
        positions[vertexIndex + 2] = z;
        vertexIndex += 3;
      }
      geometry.attributes.position.needsUpdate = true;

      // --- C. Update Lines ---
      const linePositions: number[] = [];
      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const dx = positions[i * 3] - positions[j * 3];
          const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
          const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < connectDistance * connectDistance) {
            // Alpha based on distance (fade out lines)
            linePositions.push(
              positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
              positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
            );
          }
        }
      }
      lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

      // --- D. Parallax Rotation ---
      // Gently rotate the whole group based on mouse position
      // Reduced lerp from 0.05 to 0.01 for heavier, smoother inertia
      particlesMesh.rotation.y += 0.01 * (mouseX - particlesMesh.rotation.y);
      particlesMesh.rotation.x += 0.01 * (-mouseY - particlesMesh.rotation.x);

      linesMesh.rotation.y = particlesMesh.rotation.y;
      linesMesh.rotation.x = particlesMesh.rotation.x;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    cleanup(() => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationId);
      geometry.dispose();
      pMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
      if (containerRef.value && renderer.domElement && containerRef.value.contains(renderer.domElement)) {
        containerRef.value.removeChild(renderer.domElement);
      }
    });

  }, { strategy: 'document-idle' });

  return (
    <div
      ref={containerRef}
      // z-0 ensures visibility
      class="fixed top-0 left-0 w-full h-full z-0 pointer-events-none bg-[#050505]"
    />
  );
});

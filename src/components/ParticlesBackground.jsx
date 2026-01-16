import { useRef, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import ShootingStars from './ShootingStars';

// --- Assets & Materials ---
const Earth = () => {
    const [colorMap, normalMap, specularMap, cloudsMap, nightMap, moonMap] = useLoader(THREE.TextureLoader, [
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg'
    ]);

    const earthRef = useRef();
    const cloudsRef = useRef();
    const clouds2Ref = useRef();
    const moonGroupRef = useRef();

    // Calculate real-time rotation offset focused on HCMC, Vietnam
    // HCMC Coordinates: ~10.8°N, 106.7°E
    const getRealTimeRotation = () => {
        const now = new Date();
        const utcHours = now.getUTCHours() + now.getUTCMinutes() / 60 + now.getUTCSeconds() / 3600;

        // Solar noon (sun at 0 longitude) happens at 12:00 UTC
        // The rotation needed to put longitude L at the "noon" position (facing sun/camera)
        // is approximately: (L / 180 * PI) - ((utcHours - 12) / 12 * PI)

        const dragEffect = (utcHours / 24) * Math.PI * 2;
        // We want Vietnam (106.7E) to be visible and correctly lit.
        // This formula aligns the texture so longitudes are accurate to the sun position.
        return -dragEffect + Math.PI / 2;
    };

    const initialRotation = useRef(getRealTimeRotation());

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();

        // Very slow real-time-like rotation
        const currentRotation = initialRotation.current + (t * 0.01);

        if (earthRef.current) earthRef.current.rotation.y = currentRotation;
        if (cloudsRef.current) cloudsRef.current.rotation.y = currentRotation + t * 0.005;
        if (clouds2Ref.current) clouds2Ref.current.rotation.y = currentRotation - t * 0.008;

        if (moonGroupRef.current) {
            moonGroupRef.current.rotation.y = t * 0.08;
            moonGroupRef.current.children[0].rotation.y = t * 0.05;
        }
    });

    return (
        <group
            position={[4.2, -1.0, -5]}
            rotation={[0.3, -0.5, 0]} // Tilted to make Vietnam/Asia more prominent
        >
            {/* 1. Main Planet Body */}
            <mesh ref={earthRef}>
                <sphereGeometry args={[2.0, 64, 64]} />
                <meshStandardMaterial
                    map={colorMap}
                    normalMap={normalMap}
                    normalScale={new THREE.Vector2(0.8, 0.8)}
                    roughnessMap={specularMap}
                    metalness={0.1}
                    roughness={0.7}
                    emissiveMap={nightMap}
                    emissive={new THREE.Color('#ffcc88')}
                    emissiveIntensity={2}
                />
            </mesh>

            {/* 2. Primary Cloud Layer - Use Basic for visibility regardless of light */}
            <mesh ref={cloudsRef} scale={[1.01, 1.01, 1.01]}>
                <sphereGeometry args={[2.0, 64, 64]} />
                <meshBasicMaterial
                    map={cloudsMap}
                    transparent={true}
                    opacity={0.3}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* 3. Secondary subtle cloud layer */}
            <mesh ref={clouds2Ref} scale={[1.03, 1.03, 1.03]}>
                <sphereGeometry args={[2.0, 64, 64]} />
                <meshBasicMaterial
                    map={cloudsMap}
                    transparent={true}
                    opacity={0.1}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* 4. Sharp Rim Light Effect */}
            <mesh scale={[1.002, 1.002, 1.002]}>
                <sphereGeometry args={[2.0, 64, 64]} />
                <meshBasicMaterial
                    color="#818cf8"
                    transparent
                    opacity={0.4}
                    side={THREE.BackSide}
                />
            </mesh>

            {/* 5. Moon - Simplified for visibility */}
            <group ref={moonGroupRef}>
                <mesh position={[4.5, 0.5, -1]}>
                    <sphereGeometry args={[0.45, 32, 32]} />
                    <meshBasicMaterial
                        map={moonMap}
                    />
                </mesh>
            </group>
        </group>
    );
};

// --- Animated Starfield ---
const DriftingStars = () => {
    const ref = useRef();
    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.y += delta * 0.01;
            ref.current.rotation.z += delta * 0.005;
        }
    });

    return (
        <group ref={ref}>
            <Stars radius={150} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
        </group>
    );
};

const Scene = () => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none bg-[#020617]">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ antialias: true }}>
                {/* Improved Lighting: Brighter and more front-facing */}
                <ambientLight intensity={1.2} />
                <directionalLight position={[5, 3, 10]} intensity={3} color="#fff" />
                <pointLight position={[-10, 0, -5]} intensity={1} color="#4f46e5" />

                <DriftingStars />
                <ShootingStars />

                <Suspense fallback={null}>
                    <Earth />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default Scene;

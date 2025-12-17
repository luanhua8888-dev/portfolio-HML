import { useRef, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

// --- Assets & Materials ---
const Earth = () => {
    const [colorMap, normalMap, specularMap, cloudsMap] = useLoader(THREE.TextureLoader, [
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png'
    ]);

    // Moon Texture
    const [moonColorMap] = useLoader(THREE.TextureLoader, [
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg'
    ]);

    const earthRef = useRef();
    const cloudsRef = useRef();
    const moonGroupRef = useRef();

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        // Earth spins on its axis
        if (earthRef.current) earthRef.current.rotation.y = t * 0.05;
        // Clouds move slightly independently
        if (cloudsRef.current) cloudsRef.current.rotation.y = t * 0.07;

        // Moon Orbit Logic
        if (moonGroupRef.current) {
            moonGroupRef.current.rotation.y = t * 0.2; // Orbit tracking
            // Make moon rotate on its own axis too
            moonGroupRef.current.children[0].rotation.y = t * 0.1;
        }
    });

    return (
        <group position={[2.5, 0, -3]}>
            <group rotation={[0, 0, 0.4]}>
                {/* Main Earth Sphere */}
                <mesh ref={earthRef} castShadow receiveShadow>
                    <sphereGeometry args={[1.2, 64, 64]} />
                    <meshPhongMaterial
                        map={colorMap}
                        normalMap={normalMap}
                        specularMap={specularMap}
                        shininess={5}
                    />
                </mesh>
                {/* Cloud Layer */}
                <mesh ref={cloudsRef} scale={[1.02, 1.02, 1.02]}>
                    <sphereGeometry args={[1.2, 64, 64]} />
                    <meshLambertMaterial
                        map={cloudsMap}
                        transparent
                        opacity={0.6}
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                    />
                </mesh>
                {/* Atmosphere Halo */}
                <mesh scale={[1.1, 1.1, 1.1]}>
                    <sphereGeometry args={[1.2, 64, 64]} />
                    <meshBasicMaterial
                        color="#6366f1"
                        transparent
                        opacity={0.1}
                        side={THREE.BackSide}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            </group>

            {/* Orbiting Moon Container */}
            <group ref={moonGroupRef} rotation={[0.4, 0, 0]}> {/* Tilted orbit */}
                <mesh position={[2.5, 0, 0]} castShadow receiveShadow> {/* Distance from Earth */}
                    <sphereGeometry args={[0.3, 32, 32]} />
                    <meshStandardMaterial
                        map={moonColorMap}
                        roughness={0.8}
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
        // Slow drift on Z axis to simulate travel
        if (ref.current) {
            ref.current.rotation.y += delta * 0.02; // Very slow rotation
            ref.current.rotation.z += delta * 0.01;
        }
    });

    return (
        <group ref={ref}>
            {/* Deep space stars */}
            <Stars radius={150} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </group>
    );
};

const Scene = () => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none bg-[#020617]"> {/* Darker Slate-950 background */}
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ antialias: true }}>
                {/* Logical Lighting: Sun from the right, creating realistic day/night on Earth */}
                <ambientLight intensity={0.4} />
                <directionalLight position={[10, 5, 5]} intensity={2} color="#fff1e6" castShadow />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4f46e5" /> {/* Rim light from galaxy */}

                <DriftingStars />

                <Suspense fallback={null}>
                    <Earth />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default Scene;

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Trail } from '@react-three/drei';
import * as THREE from 'three';

const Meteor = ({ onFinished }) => {
    const meshRef = useRef();
    const [config] = useState(() => {
        // Start from either left or right edges, high up
        const side = Math.random() > 0.5 ? 1 : -1;
        const startX = side * 40;
        const startY = 15 + Math.random() * 10;
        const startZ = -10 + Math.random() * -10;

        return {
            start: new THREE.Vector3(startX, startY, startZ),
            velocity: new THREE.Vector3(
                -side * (30 + Math.random() * 20), // Fly towards the opposite side quickly
                -5 - Math.random() * 10,           // Slight downward slope
                (Math.random() - 0.5) * 5
            ),
            scale: 0.05 + Math.random() * 0.1,
        };
    });

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.position.x += config.velocity.x * delta;
            meshRef.current.position.y += config.velocity.y * delta;
            meshRef.current.position.z += config.velocity.z * delta;

            if (meshRef.current.position.y < -30) {
                onFinished();
            }
        }
    });

    return (
        <Trail
            width={0.5}
            length={10}
            color={new THREE.Color('#6366f1')}
            attenuation={(t) => t * t}
        >
            <mesh ref={meshRef} position={config.start}>
                <sphereGeometry args={[config.scale, 8, 8]} />
                <meshBasicMaterial color="#fff" />
            </mesh>
        </Trail>
    );
};

const ShootingStars = () => {
    const [meteors, setMeteors] = useState([]);

    useEffect(() => {
        const spawnMeteor = () => {
            const id = Math.random();
            setMeteors(prev => [...prev, id]);

            // Increased frequency: Random delay between 5s and 15s
            const nextDelay = Math.random() * (15000 - 5000) + 5000;
            timeoutRef.current = setTimeout(spawnMeteor, nextDelay);
        };

        // Initial spawn after 2-5 seconds
        const timeoutRef = { current: setTimeout(spawnMeteor, Math.random() * 3000 + 2000) };

        return () => clearTimeout(timeoutRef.current);
    }, []);

    const removeMeteor = (id) => {
        setMeteors(prev => prev.filter(m => m !== id));
    };

    return (
        <group>
            {meteors.map(id => (
                <Meteor key={id} onFinished={() => removeMeteor(id)} />
            ))}
        </group>
    );
};

export default ShootingStars;

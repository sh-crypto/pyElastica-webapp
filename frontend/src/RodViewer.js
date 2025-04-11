import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const RodViewer = ({ rodPosition }) => {
    const mountRef = useRef(null);

    useEffect(() => {
        if (!rodPosition) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 600, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, 600);
        mountRef.current.innerHTML = "";
        mountRef.current.appendChild(renderer.domElement);

        // Create spheres at each point along the rod
        const geometry = new THREE.SphereGeometry(0.1, 16, 16);
        const material = new THREE.MeshStandardMaterial({ color: 0x007bff });

        for (let i = 0; i < rodPosition[0].length; i++) {
            const sphere = new THREE.Mesh(geometry, material);
            const x = rodPosition[0][i];
            const y = rodPosition[1][i];
            const z = rodPosition[2][i];
            sphere.position.set(x, y, z);
            scene.add(sphere);
        }

        // Lighting
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(10, 10, 10).normalize();
        scene.add(light);
        scene.add(new THREE.AmbientLight(0x404040));

        camera.position.z = 1.5;

        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();

        // Clean up
        return () => {
            renderer.dispose();
        };
    }, [rodPosition]);

    return <div ref={mountRef} />;
};

export default RodViewer;

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const RodViewer = ({ rodPosition, rodRadius }) => {
    const mountRef = useRef(null);

    useEffect(() => {
        if (!rodPosition) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        camera.position.z = 1.5;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadows

        mountRef.current.innerHTML = "";
        mountRef.current.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        const resizeRenderer = () => {
            const width = mountRef.current.clientWidth;
            const height = 600;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };

        window.addEventListener("resize", resizeRenderer);
        resizeRenderer();

        const material = new THREE.MeshStandardMaterial({
            color: 0x007bff,
            roughness: 0.4,
            metalness: 0.3,
        });

        // Add Rod Spheres
        for (let i = 0; i < rodPosition[0].length; i++) {
            const geometry = new THREE.SphereGeometry(rodRadius, 32, 32);
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(rodPosition[0][i], rodPosition[1][i], rodPosition[2][i]);
            sphere.castShadow = true; // Shadow caster
            scene.add(sphere);
        }

        // Shadow Receiving Plane
        const planeGeometry = new THREE.PlaneGeometry(10, 10);
        const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.3 });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2;
        plane.position.y = -rodRadius * 1.5;
        plane.receiveShadow = true;
        scene.add(plane);

        // Lighting
        scene.add(new THREE.AmbientLight(0x404040, 1.5));

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        const spotlight = new THREE.SpotLight(0xffffff, 0.7);
        spotlight.position.set(2, 5, 2);
        spotlight.castShadow = true;
        scene.add(spotlight);

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            while (scene.children.length > 0) {
                const obj = scene.children[0];
                scene.remove(obj);
                if (obj.geometry) obj.geometry.dispose();
                if (obj.material) obj.material.dispose();
            }
            renderer.dispose();
            window.removeEventListener("resize", resizeRenderer);
        };
    }, [rodPosition, rodRadius]);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                backgroundColor: "#000",
                borderRadius: "12px",
                padding: "20px",
                marginTop: "20px",
            }}
        >
            <div
                ref={mountRef}
                style={{
                    maxWidth: "900px",
                    width: "100%",
                }}
            />
        </div>
    );
};

export default RodViewer;

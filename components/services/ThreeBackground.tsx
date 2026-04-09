

"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const COLORS = {
  crimson: "#B9375D",
  rose: "#D25D5D",
  blush: "#E7D3D3",
  white: "#EEEEEE",
};




export default function ThreeBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const shapes = [];
    const geometries = [
      new THREE.IcosahedronGeometry(0.15, 0),
      new THREE.OctahedronGeometry(0.12, 0),
      new THREE.TetrahedronGeometry(0.14, 0),
      new THREE.BoxGeometry(0.18, 0.18, 0.18),
    ];
    const mats = [
      new THREE.MeshBasicMaterial({ color: 0xb9375d, wireframe: true, transparent: true, opacity: 0.22 }),
      new THREE.MeshBasicMaterial({ color: 0xd25d5d, wireframe: true, transparent: true, opacity: 0.15 }),
      new THREE.MeshBasicMaterial({ color: 0xe7d3d3, wireframe: true, transparent: true, opacity: 0.1 }),
    ];

    for (let i = 0; i < 38; i++) {
      const geo = geometries[Math.floor(Math.random() * geometries.length)];
      const mat = mats[Math.floor(Math.random() * mats.length)];
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set((Math.random() - 0.5) * 22, (Math.random() - 0.5) * 22, (Math.random() - 0.5) * 10 - 2);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      shapes.push({ mesh, rx: (Math.random() - 0.5) * 0.005, ry: (Math.random() - 0.5) * 0.005, vy: (Math.random() - 0.5) * 0.0018 });
      scene.add(mesh);
    }

    const dotGeo = new THREE.BufferGeometry();
    const pos = [];
    for (let x = -16; x <= 16; x += 1.6) for (let y = -16; y <= 16; y += 1.6) pos.push(x, y, -4);
    dotGeo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    scene.add(new THREE.Points(dotGeo, new THREE.PointsMaterial({ color: 0xb9375d, size: 0.022, transparent: true, opacity: 0.13 })));

    let mouse = { x: 0, y: 0 };
    const onMM = (e) => { mouse.x = (e.clientX / window.innerWidth - 0.5) * 2; mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2; };
    window.addEventListener("mousemove", onMM);

    let id;
    const animate = () => {
      id = requestAnimationFrame(animate);
      shapes.forEach(({ mesh, rx, ry, vy }) => {
        mesh.rotation.x += rx; mesh.rotation.y += ry;
        mesh.position.y += vy;
        if (mesh.position.y > 11) mesh.position.y = -11;
        if (mesh.position.y < -11) mesh.position.y = 11;
      });
      camera.position.x += (mouse.x * 0.25 - camera.position.x) * 0.02;
      camera.position.y += (mouse.y * 0.25 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => { camera.aspect = mount.clientWidth / mount.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(mount.clientWidth, mount.clientHeight); };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("mousemove", onMM);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}
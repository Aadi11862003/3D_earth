import React, { useRef, useEffect, useState } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { TextureLoader, Raycaster, Vector2, Vector3 } from "three";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { fetchWeather } from "../fetchWeather"; // Import the fetchWeather function

import daymap from "../../../src/assets/texture/solar.jpg";
import normal from "../../../src/assets/texture/EarthNormal.png";
import specular from "../../../src/assets/texture/EarthSpec.png";
import cloud from "../../../src/assets/texture/cloud.jpeg";

export function Earth({ pinPosition, setPinPosition, onWeatherDataUpdate }) {
  const { camera } = useThree();
  const [colormap, normalmap, specularmap, cloudmap] = useLoader(TextureLoader, [daymap, normal, specular, cloud]);

  const cloudref = useRef();
  const earthref = useRef();
  const pinRef = useRef();
  const raycaster = useRef(new Raycaster());
  const pointer = useRef(new Vector2());

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();

    if (cloudref.current) {
      cloudref.current.rotation.y = elapsedTime / 6;
    }

    if (earthref.current) {
      earthref.current.rotation.y = elapsedTime / 6;
    }

    if (pinRef.current && pinPosition) {
      pinRef.current.position.set(pinPosition.x, pinPosition.y, pinPosition.z);
    }
  });

  useEffect(() => {
    const handlePointerDown = async (event) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.current.setFromCamera(pointer.current, camera);

      const intersects = raycaster.current.intersectObjects([earthref.current]);

      if (intersects.length > 0) {
        const intersect = intersects[0];
        const point = intersect.point;

        const lat = 90 - Math.acos(point.y / 1.5) * (180 / Math.PI);
        const lon = ((Math.atan2(point.z, point.x) * 180) / Math.PI + 180) % 360 - 180;

        console.log(`Latitude: ${lat}, Longitude: ${lon}`);

        const radius = 1.5;
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);

        const x = -radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);

        setPinPosition(new Vector3(x, y, z));
        const weatherData = await fetchWeather(lat, lon);
        onWeatherDataUpdate(weatherData);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [camera, setPinPosition, onWeatherDataUpdate]);

  return (
    <>
      <ambientLight intensity={1.5} />
      <pointLight color="#f6f3ca" position={[2, 0, 5]} intensity={1.2} />

      <Stars
        radius={300}
        depth={60}
        count={20000}
        factor={7}
        saturation={0}
        fade={true}
      />

      <mesh ref={cloudref}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial
          map={cloudmap}
          opacity={0.4}
          depthWrite={true}
          transparent={true}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={earthref}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshPhongMaterial specularMap={specularmap} />
        <meshStandardMaterial
          map={colormap}
          normalMap={normalmap}
          metalness={0.4}
          roughness={0.7}
        />
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          zoomSpeed={0.6}
          panSpeed={0.5}
          rotateSpeed={0.4}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
        />
      </mesh>
      {pinPosition && (
        <mesh ref={pinRef} position={pinPosition}>
          <sphereGeometry args={[0.05, 32, 32]} />
          <meshStandardMaterial color="red" />
        </mesh>
      )}
    </>
  );
}


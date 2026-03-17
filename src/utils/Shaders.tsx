"use client";

import { useEffect, useRef, useCallback, RefObject } from "react";
import * as THREE from "three";

// --- IMPORTANT: THESE SHADER DEFINITIONS MUST BE HERE AT THE TOP ---
const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    varying vec2 vUv;
    uniform sampler2D u_texture;    
    uniform vec2 u_mouse;
    uniform vec2 u_prevMouse;
    uniform float u_aberrationIntensity;

    void main() {
        vec2 gridUV = floor(vUv * vec2(20.0, 20.0)) / vec2(20.0, 20.0);
        vec2 centerOfPixel = gridUV + vec2(1.0/20.0, 1.0/20.0);
        
        vec2 mouseDirection = u_mouse - u_prevMouse;
        
        vec2 pixelToMouseDirection = centerOfPixel - u_mouse;
        float pixelDistanceToMouse = length(pixelToMouseDirection);
        float strength = smoothstep(0.3, 0.0, pixelDistanceToMouse);
 
        vec2 uvOffset = strength * - mouseDirection * 0.2;
        vec2 uv = vUv - uvOffset;

        vec4 colorR = texture2D(u_texture, uv + vec2(strength * u_aberrationIntensity * 0.01, 0.0));
        vec4 colorG = texture2D(u_texture, uv);
        vec4 colorB = texture2D(u_texture, uv - vec2(strength * u_aberrationIntensity * 0.01, 0.0));

        gl_FragColor = vec4(colorR.r, colorG.g, colorB.b, 1.0);
    }
`;

export const useImageDistortion = (imageUrl: string): [RefObject<HTMLDivElement | null>, RefObject<HTMLImageElement | null>] => {
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageElementRef = useRef<HTMLImageElement>(null);
  const isInitializedRef = useRef(false);
  const animationFrameId = useRef<number | null>(null);

  // THREE.js state variables
  const scene = useRef<THREE.Scene | null>(null);
  const camera = useRef<THREE.PerspectiveCamera | null>(null);
  const renderer = useRef<THREE.WebGLRenderer | null>(null);
  const planeMesh = useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial> | null>(null);

  // Animation variables
  const mousePosition = useRef({ x: 0.5, y: 0.5 });
  const targetMousePosition = useRef({ x: 0.5, y: 0.5 });
  const prevPosition = useRef({ x: 0.5, y: 0.5 });
  const aberrationIntensity = useRef(0.0);
  const easeFactor = useRef(0.02);

  const animateScene = useCallback(() => {
    if (!renderer.current || !planeMesh.current || !scene.current || !camera.current) {
      return;
    }

    mousePosition.current.x +=
      (targetMousePosition.current.x - mousePosition.current.x) *
      easeFactor.current;
    mousePosition.current.y +=
      (targetMousePosition.current.y - mousePosition.current.y) *
      easeFactor.current;

    planeMesh.current.material.uniforms.u_mouse.value.set(
      mousePosition.current.x,
      1.0 - mousePosition.current.y
    );

    planeMesh.current.material.uniforms.u_prevMouse.value.set(
      prevPosition.current.x,
      1.0 - prevPosition.current.y
    );

    aberrationIntensity.current = Math.max(
      0.0,
      aberrationIntensity.current - 0.05
    );
    planeMesh.current.material.uniforms.u_aberrationIntensity.value =
      aberrationIntensity.current;

    renderer.current.render(scene.current, camera.current);
    animationFrameId.current = requestAnimationFrame(animateScene);
  }, []);

  const initializeScene = useCallback(
    (texture: THREE.Texture) => {
      if (!imageContainerRef.current || !imageElementRef.current) {
        return;
      }

      if (renderer.current) {
        if (imageContainerRef.current.contains(renderer.current.domElement)) {
          imageContainerRef.current.removeChild(renderer.current.domElement);
        }
        renderer.current.dispose();
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }

      const imageWidth = imageElementRef.current.offsetWidth;
      const imageHeight = imageElementRef.current.offsetHeight;

      if (imageWidth === 0 || imageHeight === 0) {
        return;
      }

      const aspectRatio = imageWidth / imageHeight;
      const planeHeight = 2;
      const planeWidth = planeHeight * aspectRatio;

      scene.current = new THREE.Scene();

      camera.current = new THREE.PerspectiveCamera(
        80,
        imageWidth / imageHeight,
        0.01,
        10
      );
      camera.current.position.z = 1;

      const shaderUniforms = {
        u_mouse: { value: new THREE.Vector2() },
        u_prevMouse: { value: new THREE.Vector2() },
        u_aberrationIntensity: { value: 0.0 },
        u_texture: { value: texture },
      };

      planeMesh.current = new THREE.Mesh(
        new THREE.PlaneGeometry(planeWidth, planeHeight),
        new THREE.ShaderMaterial({
          uniforms: shaderUniforms,
          vertexShader,
          fragmentShader,
        })
      );

      scene.current.add(planeMesh.current);

      renderer.current = new THREE.WebGLRenderer({ alpha: true });
      renderer.current.setSize(imageWidth, imageHeight);
      renderer.current.setPixelRatio(window.devicePixelRatio);

      imageContainerRef.current.appendChild(renderer.current.domElement);

      if (renderer.current && planeMesh.current) {
        animateScene();
        isInitializedRef.current = true;
      }
    },
    [animateScene]
  );

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!imageContainerRef.current) return;
    easeFactor.current = 0.02;
    const rect = imageContainerRef.current.getBoundingClientRect();
    prevPosition.current = { ...targetMousePosition.current };

    targetMousePosition.current.x = (event.clientX - rect.left) / rect.width;
    targetMousePosition.current.y = (event.clientY - rect.top) / rect.height;

    aberrationIntensity.current = 1;
  }, []);

  const handleMouseEnter = useCallback((event: MouseEvent) => {
    if (!imageContainerRef.current) return;
    easeFactor.current = 0.02;
    const rect = imageContainerRef.current.getBoundingClientRect();

    mousePosition.current.x = targetMousePosition.current.x =
      (event.clientX - rect.left) / rect.width;
    mousePosition.current.y = targetMousePosition.current.y =
      (event.clientY - rect.top) / rect.height;

    aberrationIntensity.current = 1;
  }, []);

  const handleMouseLeave = useCallback(() => {
    easeFactor.current = 0.05;
    targetMousePosition.current = { ...prevPosition.current };
    aberrationIntensity.current = 0;
  }, []);

  useEffect(() => {
    if (imageUrl && imageElementRef.current && !isInitializedRef.current) {
      const loader = new THREE.TextureLoader();
      loader.load(
        imageUrl,
        (texture) => {
          initializeScene(texture);
        },
        undefined,
        () => {}
      );
    }

    const container = imageContainerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
      if (renderer.current) {
        renderer.current.dispose();

        if (container && container.contains(renderer.current.domElement)) {
          container.removeChild(renderer.current.domElement);
        }
      }
      isInitializedRef.current = false;

      scene.current = null;
      camera.current = null;
      renderer.current = null;
      planeMesh.current = null;
      animationFrameId.current = null;
    };
  }, [
    imageUrl,
    initializeScene,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
  ]);

  return [imageContainerRef, imageElementRef];
};

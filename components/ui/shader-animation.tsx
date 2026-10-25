"use client"

import React, { useEffect, useRef } from "react"
import * as THREE from "three"
import { cn } from "@/lib/utils"

interface ShaderAnimationProps {
  className?: string
  style?: React.CSSProperties
  speed?: number
  opacity?: number
}

export function ShaderAnimation({ 
  className, 
  style,
  speed = 0.04,
  opacity = 0.65
}: ShaderAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    camera: THREE.Camera
    scene: THREE.Scene
    renderer: THREE.WebGLRenderer
    uniforms: {
      time: { type: string; value: number }
      resolution: { type: string; value: THREE.Vector2 }
    }
    animationId: number
  } | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    // Vertex shader
    const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `

    // Fragment shader: customized with TriNETRA Jet Black, Hot Pink (#ff2a8d), & Chartreuse (#e5ff40)
    const fragmentShader = `
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359

      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time * 0.04;
        float lineWidth = 0.0022;

        vec3 color = vec3(0.0);
        for(int j = 0; j < 3; j++){
          for(int i = 0; i < 5; i++){
            color[j] += lineWidth * float(i * i) / abs(fract(t - 0.01 * float(j) + float(i) * 0.01) * 5.0 - length(uv) + mod(uv.x + uv.y, 0.22));
          }
        }
        
        // TriNETRA Theme Color Mapping:
        // Hot Pink (#ff2a8d) and High-Voltage Chartreuse (#e5ff40) on pure Jet Black canvas
        vec3 pink = vec3(1.0, 0.165, 0.553);
        vec3 chartreuse = vec3(0.898, 1.0, 0.251);
        vec3 deepPurple = vec3(0.35, 0.04, 0.45);

        vec3 trinetraColor = color.r * pink * 1.3 + color.g * chartreuse * 0.8 + color.b * deepPurple * 0.7;
        
        gl_FragColor = vec4(trinetraColor, 1.0);
      }
    `

    // Initialize Three.js scene
    const camera = new THREE.Camera()
    camera.position.z = 1

    const scene = new THREE.Scene()
    const geometry = new THREE.PlaneGeometry(2, 2)

    const uniforms = {
      time: { type: "f", value: 1.0 },
      resolution: { type: "v2", value: new THREE.Vector2() },
    }

    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    container.appendChild(renderer.domElement)

    // Handle window resize
    const onWindowResize = () => {
      if (!container || !renderer) return
      const width = container.clientWidth
      const height = container.clientHeight
      renderer.setSize(width, height)
      uniforms.resolution.value.x = renderer.domElement.width
      uniforms.resolution.value.y = renderer.domElement.height
    }

    onWindowResize()
    window.addEventListener("resize", onWindowResize, false)

    // Animation loop
    const animate = () => {
      const animationId = requestAnimationFrame(animate)
      uniforms.time.value += speed
      renderer.render(scene, camera)

      if (sceneRef.current) {
        sceneRef.current.animationId = animationId
      }
    }

    sceneRef.current = {
      camera,
      scene,
      renderer,
      uniforms,
      animationId: 0,
    }

    animate()

    // Cleanup function
    return () => {
      window.removeEventListener("resize", onWindowResize)

      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId)

        if (container && sceneRef.current.renderer.domElement) {
          try {
            container.removeChild(sceneRef.current.renderer.domElement)
          } catch {
            // Already detached
          }
        }

        sceneRef.current.renderer.dispose()
        geometry.dispose()
        material.dispose()
      }
    }
  }, [speed])

  return (
    <div
      ref={containerRef}
      className={cn("w-full h-full pointer-events-none overflow-hidden", className)}
      style={{
        background: "transparent",
        opacity,
        ...style,
      }}
    />
  )
}
export default ShaderAnimation

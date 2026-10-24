"use client"

import React, { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

interface GenkubRobotSceneProps {
  className?: string
  modelScale?: number
}

export default function GenkubRobotScene({ className = "", modelScale = 2.4 }: GenkubRobotSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let width = container.clientWidth || 400
    let height = container.clientHeight || 400

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000)
    camera.position.set(0, 0, 4.2)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.3
    container.appendChild(renderer.domElement)

    // Lighting setup for high-contrast obsidian + hot pink + chartreuse aesthetic
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5)
    scene.add(ambientLight)

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.2)
    mainLight.position.set(5, 8, 5)
    scene.add(mainLight)

    // Vivid Hot pink rim light
    const pinkRim = new THREE.DirectionalLight(0xff2a8d, 3.2)
    pinkRim.position.set(-6, 3, -1)
    scene.add(pinkRim)

    // High-voltage Chartreuse accent light
    const chartreuseLight = new THREE.PointLight(0xe5ff40, 2.8, 12)
    chartreuseLight.position.set(4, -2, 2.5)
    scene.add(chartreuseLight)

    let modelRoot: THREE.Group | null = null
    let headNode: THREE.Object3D | null = null
    let eyesNode: THREE.Object3D | null = null
    let neckNode: THREE.Object3D | null = null
    let mixer: THREE.AnimationMixer | null = null

    const initialHeadRot = new THREE.Euler()
    const initialEyesRot = new THREE.Euler()
    const initialNeckRot = new THREE.Euler()

    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 }

    const onMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = -(e.clientY / window.innerHeight) * 2 + 1
      mouse.targetX = THREE.MathUtils.clamp(nx, -1, 1)
      mouse.targetY = THREE.MathUtils.clamp(ny, -1, 1)
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true })

    // Load genkub_greeting_robot.glb
    const loader = new GLTFLoader()
    loader.load(
      "/models/genkub_greeting_robot.glb",
      (gltf) => {
        modelRoot = gltf.scene

        // Find Head, Eyes, and Neck nodes
        modelRoot.traverse((child) => {
          const name = child.name.toLowerCase()
          if (child.name === "Head" || (name.includes("head") && !headNode)) {
            headNode = child
            initialHeadRot.copy(child.rotation)
          }
          if (child.name === "Eyes Move" || child.name === "Eyes" || (name.includes("eye") && !eyesNode)) {
            eyesNode = child
            initialEyesRot.copy(child.rotation)
          }
          if (child.name === "Neck" || (name.includes("neck") && !neckNode)) {
            neckNode = child
            initialNeckRot.copy(child.rotation)
          }
        })

        // Center and normalize model bounds
        const box = new THREE.Box3().setFromObject(modelRoot)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z) || 1
        const scale = modelScale / maxDim
        modelRoot.scale.setScalar(scale)
        modelRoot.position.set(-center.x * scale, -center.y * scale - 0.08, -center.z * scale)

        scene.add(modelRoot)

        // Play idle / greeting animations if available
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(modelRoot)
          gltf.animations.forEach((clip) => {
            const action = mixer?.clipAction(clip)
            action?.play()
          })
        }

        setLoading(false)
      },
      undefined,
      (err) => {
        console.error("Failed to load genkub_greeting_robot.glb:", err)
        setLoading(false)
      }
    )

    let animationFrameId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const delta = clock.getDelta()

      if (mixer) {
        mixer.update(delta)
      }

      // Smooth cursor interpolation
      mouse.x = THREE.MathUtils.lerp(mouse.x, mouse.targetX, 0.08)
      mouse.y = THREE.MathUtils.lerp(mouse.y, mouse.targetY, 0.08)

      // Rotate Head to look at cursor
      if (headNode) {
        headNode.rotation.y = initialHeadRot.y + THREE.MathUtils.lerp(0, mouse.x * 0.65, 0.1)
        headNode.rotation.x = initialHeadRot.x + THREE.MathUtils.lerp(0, -mouse.y * 0.45, 0.1)
      }

      // Rotate Eyes with responsive tracking
      if (eyesNode) {
        eyesNode.rotation.y = initialEyesRot.y + THREE.MathUtils.lerp(0, mouse.x * 0.85, 0.15)
        eyesNode.rotation.x = initialEyesRot.x + THREE.MathUtils.lerp(0, -mouse.y * 0.65, 0.15)
      }

      // Subtle neck alignment
      if (neckNode) {
        neckNode.rotation.y = initialNeckRot.y + THREE.MathUtils.lerp(0, mouse.x * 0.25, 0.06)
      }

      // Gentle floating hover & slight body turn
      if (modelRoot) {
        const t = clock.getElapsedTime()
        modelRoot.rotation.y = mouse.x * 0.18
        modelRoot.position.y += Math.sin(t * 2.2) * 0.0007
      }

      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      if (!container) return
      width = container.clientWidth || 400
      height = container.clientHeight || 400
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameId)
      renderer.dispose()
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [modelScale])

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ff2a8d] border-t-transparent" />
        </div>
      )}
      <div ref={containerRef} className="h-full w-full pointer-events-none" />
    </div>
  )
}

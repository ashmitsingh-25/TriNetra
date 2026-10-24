"use client"

import React, { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

interface GenkubRobotSceneProps {
  className?: string
}

export default function GenkubRobotScene({ className = "" }: GenkubRobotSceneProps) {
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
    renderer.toneMappingExposure = 1.2
    container.appendChild(renderer.domElement)

    // Lighting with TriNETRA theme accents
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4)
    scene.add(ambientLight)

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.0)
    mainLight.position.set(5, 8, 5)
    scene.add(mainLight)

    // Hot pink rim light
    const pinkRim = new THREE.DirectionalLight(0xff2a8d, 2.5)
    pinkRim.position.set(-5, 3, -2)
    scene.add(pinkRim)

    // Chartreuse under-glow
    const chartreuseGlow = new THREE.PointLight(0xe5ff40, 2.0, 10)
    chartreuseGlow.position.set(0, -2, 2)
    scene.add(chartreuseGlow)

    let modelRoot: THREE.Group | null = null
    let headNode: THREE.Object3D | null = null
    let eyesNode: THREE.Object3D | null = null
    let neckNode: THREE.Object3D | null = null
    let mixer: THREE.AnimationMixer | null = null

    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 }

    const onMouseMove = (e: MouseEvent) => {
      // Normalize to -1 ... 1 based on window
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = -(e.clientY / window.innerHeight) * 2 + 1
      mouse.targetX = THREE.MathUtils.clamp(nx, -1, 1)
      mouse.targetY = THREE.MathUtils.clamp(ny, -1, 1)
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true })

    const loader = new GLTFLoader()
    loader.load(
      "/models/genkub_greeting_robot.gltf",
      (gltf) => {
        modelRoot = gltf.scene

        // Traverse to locate head, eyes, and apply material upgrades
        modelRoot.traverse((child) => {
          const name = child.name.toLowerCase()
          if (name === "head" || name.includes("head")) {
            if (!headNode || child.name === "Head") headNode = child
          }
          if (name.includes("eye") || name === "eyes move") {
            if (!eyesNode || child.name === "Eyes Move") eyesNode = child
          }
          if (name.includes("neck")) {
            neckNode = child
          }
        })

        // Center and normalize model size
        const box = new THREE.Box3().setFromObject(modelRoot)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z) || 1
        const scale = 2.4 / maxDim
        modelRoot.scale.setScalar(scale)
        modelRoot.position.set(-center.x * scale, -center.y * scale - 0.1, -center.z * scale)

        scene.add(modelRoot)

        // Play animations if present
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
        console.error("Failed to load genkub_greeting_robot.gltf:", err)
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

      // Smooth interpolation towards cursor
      mouse.x = THREE.MathUtils.lerp(mouse.x, mouse.targetX, 0.08)
      mouse.y = THREE.MathUtils.lerp(mouse.y, mouse.targetY, 0.08)

      // Rotate Head to look at cursor
      if (headNode) {
        headNode.rotation.y = THREE.MathUtils.lerp(headNode.rotation.y, mouse.x * 0.65, 0.1)
        headNode.rotation.x = THREE.MathUtils.lerp(headNode.rotation.x, -mouse.y * 0.45, 0.1)
      }

      // Rotate Eyes with slightly faster responsiveness
      if (eyesNode) {
        eyesNode.rotation.y = THREE.MathUtils.lerp(eyesNode.rotation.y, mouse.x * 0.85, 0.15)
        eyesNode.rotation.x = THREE.MathUtils.lerp(eyesNode.rotation.x, -mouse.y * 0.65, 0.15)
      }

      // Subtle neck alignment
      if (neckNode) {
        neckNode.rotation.y = THREE.MathUtils.lerp(neckNode.rotation.y, mouse.x * 0.25, 0.06)
      }

      // Gentle floating hover motion for the whole robot
      if (modelRoot) {
        const t = clock.getElapsedTime()
        modelRoot.position.y += Math.sin(t * 2) * 0.0008
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
  }, [])

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

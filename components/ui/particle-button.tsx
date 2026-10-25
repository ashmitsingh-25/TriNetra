"use client"

import * as React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import type { ButtonProps } from "@/components/ui/button"

interface ParticleButtonProps extends ButtonProps {
  onSuccess?: () => void
  successDuration?: number
  particleColor?: string
}

function SuccessParticles({
  buttonRef,
  particleColor,
}: {
  buttonRef: React.RefObject<HTMLButtonElement | null>
  particleColor?: string
}) {
  const rect = buttonRef.current?.getBoundingClientRect()
  if (!rect) return null

  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  const colors = particleColor ? [particleColor] : ["#ff2a8d", "#e5ff40", "#ffffff", "#ff0066"]

  return (
    <AnimatePresence>
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed w-1.5 h-1.5 rounded-full pointer-events-none z-[100001]"
          style={{ 
            left: centerX, 
            top: centerY,
            backgroundColor: colors[i % colors.length]
          }}
          initial={{
            scale: 0,
            x: 0,
            y: 0,
            opacity: 1,
          }}
          animate={{
            scale: [0, 1.4, 0],
            x: [0, (i % 2 ? 1 : -1) * (Math.random() * 55 + 20)],
            y: [0, -Math.random() * 55 - 20],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 0.65,
            delay: i * 0.05,
            ease: "easeOut",
          }}
        />
      ))}
    </AnimatePresence>
  )
}

function ParticleButton({
  children,
  onClick,
  onSuccess,
  successDuration = 1000,
  particleColor,
  className,
  ...props
}: ParticleButtonProps) {
  const [showParticles, setShowParticles] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setShowParticles(true)

    if (onClick) {
      onClick(e)
    }

    if (onSuccess) {
      onSuccess()
    }

    setTimeout(() => {
      setShowParticles(false)
    }, successDuration)
  }

  return (
    <>
      {showParticles && (
        <SuccessParticles 
          buttonRef={buttonRef} 
          particleColor={particleColor} 
        />
      )}
      <Button
        ref={buttonRef}
        onClick={handleClick}
        className={cn(
          "relative",
          showParticles && "scale-95",
          "transition-transform duration-100",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    </>
  )
}

export { ParticleButton }

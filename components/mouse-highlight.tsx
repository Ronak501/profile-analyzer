"use client"

import { useEffect, useState, useRef } from "react"

export default function MouseHighlight() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [isMoving, setIsMoving] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
      setIsMoving(true)

      // Reset the moving state after a short delay to create a trailing effect
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        setIsMoving(false)
      }, 100)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    window.addEventListener("mousemove", handleMouseMove)
    document.body.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.body.removeEventListener("mouseleave", handleMouseLeave)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  if (!isVisible) return null

  return (
    <>
      {/* Main glow */}
      <div
        className="pointer-events-none fixed z-50 h-[200px] w-[200px] rounded-full bg-white/15 opacity-50 blur-3xl transition-all duration-300 ease-out"
        style={{
          transform: `translate(${position.x - 100}px, ${position.y - 100}px)`,
          opacity: isMoving ? 0.5 : 0.3,
          transition: "transform 0.3s ease-out, opacity 0.5s ease-out",
        }}
      />

      {/* Inner brighter glow */}
      <div
        className="pointer-events-none fixed z-50 h-[100px] w-[100px] rounded-full bg-white/30 opacity-60 blur-xl transition-all duration-200 ease-out"
        style={{
          transform: `translate(${position.x - 50}px, ${position.y - 50}px)`,
          opacity: isMoving ? 0.6 : 0.4,
          transition: "transform 0.2s ease-out, opacity 0.4s ease-out",
        }}
      />

      {/* Small core highlight */}
      <div
        className="pointer-events-none fixed z-50 h-[30px] w-[30px] rounded-full bg-white/50 opacity-70 blur-sm transition-all duration-100 ease-out"
        style={{
          transform: `translate(${position.x - 15}px, ${position.y - 15}px)`,
          opacity: isMoving ? 0.7 : 0.5,
          transition: "transform 0.1s linear",
        }}
      />
    </>
  )
}


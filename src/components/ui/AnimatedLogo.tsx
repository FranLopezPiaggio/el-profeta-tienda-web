'use client'

import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface AnimatedLogoProps {
  logoSrc?: string
}

export function AnimatedLogo({ logoSrc = '/logo-removebg-preview.png' }: AnimatedLogoProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!containerRef.current || !logoRef.current) return

    const ctx = gsap.context(() => {
      const catalogSection = document.getElementById('catalogo')
      
      // Get container dimensions for corner calculation
      const getCornerPosition = () => {
        const containerWidth = containerRef.current?.offsetWidth || 1080
        // Corner position: right side minus logo width (120px) minus padding
        return containerWidth - 140
      }

      // Animation: Logo moves from center → corner AND shrinks
      gsap.to(logoRef.current, {
        scrollTrigger: {
          trigger: catalogSection || containerRef.current,
          start: 'top top',
          end: 'top top',
          scrub: 0.5,
        },
        // Move to top-right corner
        x: getCornerPosition(),
        y: 20,
        // Shrink to 60% (40% smaller)
        scale: 0.6,
        // Keep centered horizontally during movement
        xPercent: 0,
        transformOrigin: 'center center',
        ease: 'power2.inOut',
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0"
    >
      <div 
        ref={logoRef}
        className="absolute"
        style={{
          top: '35%',
          left: '50%',
          transform: 'translate(-50%, 0)',
          width: '280px',
          height: '280px',
        }}
      >
        <Image
          src={logoSrc}
          alt="El Profeta"
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  )
}
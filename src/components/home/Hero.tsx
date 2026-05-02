'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRef, useLayoutEffect, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const heroImage = '/Gemini_Generated_Image_op9pknop9pknop9p.png'

export function Hero() {
  const logoRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  useLayoutEffect(() => {
    if (!logoRef.current || !containerRef.current || !contentRef.current || !isMounted) return

    const ctx = gsap.context(() => {
      const catalogSection = document.getElementById('catalogo')
      if (!catalogSection) return

      // === Hero Pin: Keep Hero in view while catalog scrolls underneath ===
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 80px',
        end: () => `+=${catalogSection.offsetHeight}`,
        pin: true,
        pinSpacing: false,
        anticipatePin: 1,
      })

      // === Parallax: Logo drifts down as user scrolls through hero ===
      gsap.to(logoRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80px',
          end: 'bottom top',
          scrub: 1,
        },
        y: 120,
        ease: 'none',
      })

      // === Content fade: Fade hero content as we scroll into catalog ===
      gsap.to(contentRef.current, {
        scrollTrigger: {
          trigger: catalogSection,
          start: 'top 80px',
          end: 'top 40px',
          scrub: 1,
        },
        opacity: 0,
        y: -30,
        ease: 'none',
      })

      // === Catalog slides up from underneath ===
      gsap.fromTo(catalogSection, 
        { yPercent: 0 },
        {
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80px',
            end: () => `+=${catalogSection.offsetHeight}`,
            scrub: 1,
          },
          yPercent: -30,
          ease: 'none',
        }
      )

    }, containerRef)

    return () => {
      ctx.revert()
    }
  }, [isMounted])

  return (
    <section 
      ref={containerRef}
      className="min-h-[60vh] flex items-center relative gsap-hero"
      style={{ 
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/60" />

      <div 
        ref={contentRef}
        className="relative z-10 w-full max-w-6xl mx-auto flex"
      >
        <div className="w-1/2 flex items-center justify-center">
          <div 
            ref={logoRef}
            className="relative will-change-transform"
            style={{
              width: '280px',
              height: '280px',
              filter: 'drop-shadow(8px 8px 4px rgba(92, 54, 29, 0.25))',
            }}
          >
            <Image
              src="/logo-removebg-preview.png"
              alt="El Profeta"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="w-1/2 flex flex-col items-start justify-center pl-8">
          <h1 
            className="text-5xl md:text-7xl font-bold mb-4 font-serif"
            style={{
              color: '#F2EBD1',
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              fontFamily: 'var(--font-alfa-slab), Georgia, serif',
              fontWeight: 400,
              // Border efecto con text-stroke
              WebkitTextStroke: '5px #5C361D',
              textShadow: '6px 6px 0px rgba(92, 54, 29, 0.3)',
              filter: 'drop-shadow(8px 8px 4px rgba(92, 54, 29, 0.25))',
            }}
          >
            El Profeta
          </h1>
          <Link 
            href="/#catalogo"
            className="px-8 py-4 bg-amber-500 text-brown-900 font-bold text-lg rounded-full hover:bg-amber-400 transition-colors"
          >
            Ver Productos
          </Link>
        </div>
      </div>
    </section>
  )
}
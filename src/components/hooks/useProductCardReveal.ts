'use client'

import { useLayoutEffect, useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface UseProductCardRevealOptions {
  /** 
   * Trigger element selector or ref.
   * When this enters viewport, cards will animate in.
   * Default: '.product-grid'
   */
  trigger?: string
  /** 
   * Start position relative to trigger.
   * Default: 'top 90%' (just before it fully enters viewport)
   */
  start?: string
  /** 
   * Stagger delay between cards in seconds.
   * Default: 0.08
   */
  stagger?: number
  /** 
   * Animation duration per card in seconds.
   * Default: 0.5
   */
  duration?: number
  /** 
   * Y offset for initial state (from).
   * Default: 40
   */
  yOffset?: number
  /** 
   * Y easing - 'power2.out' for slide-up, 'back.out(1.7)' for pop-in.
   * Default: 'power2.out'
   */
  ease?: string
}

/**
 * Hook to animate product cards with staggered reveal on scroll.
 * 
 * Works on both:
 * - Homepage: Hero pins, catalog scrolls underneath, cards stagger when section enters
 * - /catalogo page: Cards stagger when page scrolls into view
 * 
 * Accessibility: Respects prefers-reduced-motion
 */
export function useProductCardReveal(options: UseProductCardRevealOptions = {}) {
  const {
    trigger = '.product-grid',
    start = 'top 90%',
    stagger = 0.08,
    duration = 0.5,
    yOffset = 40,
    ease = 'power2.out',
  } = options

  const containerRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const hasAnimatedRef = useRef(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useLayoutEffect(() => {
    if (!containerRef.current || !isMounted || hasAnimatedRef.current) return

    const container = containerRef.current
    const cards = container.querySelectorAll<HTMLElement>('article')

    if (cards.length === 0) return

    // Skip animation for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      // Set visible immediately
      cards.forEach(card => {
        card.style.opacity = '1'
        card.style.transform = 'none'
      })
      return
    }

    // Set initial state - cards are hidden and offset
    gsap.set(cards, {
      y: yOffset,
      opacity: 0,
      autoAlpha: 0,
    })

    const ctx = gsap.context(() => {
      const scrollTrigger = ScrollTrigger.create({
        trigger: container,
        start,
        toggleActions: 'play none none reverse',
        onEnter: () => {
          // Animate cards in with stagger
          gsap.to(cards, {
            y: 0,
            opacity: 1,
            autoAlpha: 1,
            duration,
            stagger,
            ease,
            overwrite: 'auto',
          })
          hasAnimatedRef.current = true
        },
        onLeave: () => {
          // Optionally keep visible after leaving (could be 'none' to not reverse)
        },
        onEnterBack: () => {
          gsap.to(cards, {
            y: 0,
            opacity: 1,
            autoAlpha: 1,
            duration,
            stagger,
            ease,
          })
        },
        onLeaveBack: () => {
          gsap.to(cards, {
            y: yOffset,
            opacity: 0,
            autoAlpha: 0,
            duration: duration * 0.5,
            stagger: stagger * 0.5,
            ease: 'power2.in',
          })
        },
      })

      // Optional: scrub with scroll (adds scroll-linked animation)
      // Uncomment if you want cards to animate in/out with scroll position
      // scrollTrigger.scrollTrigger?.update()

    }, container)

    return () => {
      ctx.revert()
      hasAnimatedRef.current = false
    }
  }, [isMounted, trigger, start, stagger, duration, yOffset, ease])

  return containerRef
}
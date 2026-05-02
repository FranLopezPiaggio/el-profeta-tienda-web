'use client'

import { useEffect, useRef, useState } from 'react'

// Module-level state for Hero↔Navbar morph coordination
// Used by Hero.tsx (writes) and Navbar.tsx (reads)

export interface LogoMorphState {
  scrollProgress: number      // 0 = top of page, 1 = fully scrolled through Hero
  isPinned: boolean           // true when Hero section is pinned
  morphComplete: boolean     // true when logo has morphed into Navbar position
  heroLogoVisible: boolean   // false after morph completes (portal mounted to Navbar)
  navbarLogoVisible: boolean   // true after morph completes
}

type LogoMorphListener = (state: LogoMorphState) => void

let globalState: LogoMorphState = {
  scrollProgress: 0,
  isPinned: false,
  morphComplete: false,
  heroLogoVisible: true,
  navbarLogoVisible: false,
}

const listeners = new Set<LogoMorphListener>()

function emit() {
  listeners.forEach(listener => listener(globalState))
}

export function setLogoMorphState(partial: Partial<LogoMorphState>) {
  globalState = { ...globalState, ...partial }
  emit()
}

export function getLogoMorphState(): LogoMorphState {
  return globalState
}

/**
 * Hook for Hero.tsx to control the morph animation
 * - Writes scroll progress and morph state
 * - Used by GSAP ScrollTrigger to animate
 */
export function useLogoMorphController() {
  const [state, setState] = useState<LogoMorphState>(globalState)

  useEffect(() => {
    const listener: LogoMorphListener = (newState) => {
      setState(newState)
    }
    listeners.add(listener)
    emit() // Sync current state on mount
    return () => { listeners.delete(listener) }
  }, [])

  return { state, setState: setLogoMorphState }
}

/**
 * Hook for Navbar.tsx to receive morph state
 * - Reads scroll progress and morph state
 * - Toggles logo visibility at the right moment
 */
export function useLogoMorphReceiver() {
  const [state, setState] = useState<LogoMorphState>(globalState)

  useEffect(() => {
    const listener: LogoMorphListener = (newState) => {
      setState(newState)
    }
    listeners.add(listener)
    return () => { listeners.delete(listener) }
  }, [])

  return state
}

/**
 * Reset state when navigating to a new page
 * Call this in a useEffect in pages that need fresh state
 */
export function resetLogoMorphState() {
  globalState = {
    scrollProgress: 0,
    isPinned: false,
    morphComplete: false,
    heroLogoVisible: true,
    navbarLogoVisible: false,
  }
  emit()
}
import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  width?: number
  height?: number
  className?: string
  progress?: number  // 0 = no scroll, 1 = fully scrolled
}

export function Logo({ width = 100, height = 62, className = '', progress = 0 }: LogoProps) {
  // Progressive scale: 1.0 → 0.85 based on scroll progress
  const scale = 1 - (progress * 0.15) // 1.0 → 0.85 smoothly

  return (
    <Link href="/" className={`relative z-[60] flex items-center pt-15 ${className}`}>
      <Image
        src="/elprofetalogo-removebg-preview.png"
        alt="El Profeta"
        width={width}
        height={height}
        className="object-contain transition-transform duration-200 ease-out will-change-transform"
        style={{ 
          transform: `scale(${scale})`,
          transformOrigin: 'center left'
        }}
        priority
      />
    </Link>
  )
}
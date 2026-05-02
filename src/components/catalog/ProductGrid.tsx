'use client'

import type { Product } from '@/lib/types'
import { ProductCard } from './ProductCard'
import { useProductCardReveal } from '../hooks/useProductCardReveal'

interface ProductGridProps {
  products: Product[]
  /** 
   * Enable staggered reveal animation on scroll.
   * Default: true for homepage, can be disabled for static display
   */
  animate?: boolean
  /** 
   * CSS class for the grid container.
   * Used by useProductCardReveal to find the trigger element.
   * Default: 'product-grid'
   */
  className?: string
}

export function ProductGrid({ products, animate = true, className = 'product-grid' }: ProductGridProps) {
  const containerRef = useProductCardReveal({
    trigger: `.${className.replace(/\s+/g, '.')}`,
    start: 'top 90%',
  })

  return (
    <div 
      ref={animate ? containerRef : undefined}
      className={`grid 
        ${className}
        grid-cols-3
        gap-1.5
        px-1
        w-full`}
    >
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
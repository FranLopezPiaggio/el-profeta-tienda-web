'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Product } from '@/lib/types'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore(state => state.addItem)
  
  const decrement = () => setQuantity(q => Math.max(1, q - 1))
  const increment = () => setQuantity(q => Math.min(99, q + 1))
  
  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }
  
  // Extract ABV from description if present
  const abvMatch = product.description?.match(/(\d+%)/)
  const abv = abvMatch ? abvMatch[1] : null
  
  return (
    <article className="bg-white/95 backdrop-blur-sm border border-[#E8DDD0] rounded-lg overflow-hidden shadow-sm flex flex-col">
      {/* Image container - smaller compact */}
      <div className="aspect-square bg-[#E8DDD0]/30 relative w-full">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="33vw"
          className="object-cover"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBQYSIRMxQWH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABsRAAICAwEAAAAAAAAAAAAAAAECAAMEESFB/9oADAMBAAIRAxEAPwCvpGsWWo2kd3aXEc0Mg5RyRsGVh8gg4I/VQ1W/TTbS4W2s7iK3hQBYooYyiqPYAHAH6K5vS9XvdGvEvrC4eCZODxOP0HqD0QfcH4e6f7d6l1DVrT5TXdy1xcFseZ+x7k+wOwPsD7edI8msrI0pQ7R//2Q=="
        />
      </div>
      
      {/* Content - smaller compact */}
      <div className="p-1.5 space-y-1 flex-1 flex flex-col">
        <span className="text-[8px] uppercase tracking-wider text-[#8B6B4D] font-medium truncate">
          {product.category}
        </span>
        
        <h3 className="font-[family-name:var(--font-alfa-slab)] text-xs text-[#5C361D] leading-tight line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-sm font-semibold text-[#B4753F]">
          {formatPrice(product.price)}
        </p>
        
        {abv && (
          <p className="text-[10px] text-[#8B6B4D]">
            {abv} alcohol
          </p>
        )}
        
        {/* Compact quantity selector */}
        <div className="flex items-center gap-1 py-0.5 mt-auto">
          <button
            onClick={decrement}
            className="w-7 h-7 flex items-center justify-center border border-[#E8DDD0] rounded hover:bg-[#F7F3E8] text-[#5C361D] text-xs"
            aria-label="Decrease quantity"
            type="button"
          >
            −
          </button>
          
          <span className="w-5 text-center font-medium text-[#5C361D] text-xs">
            {quantity}
          </span>
          
          <button
            onClick={increment}
            className="w-7 h-7 flex items-center justify-center border border-[#E8DDD0] rounded hover:bg-[#F7F3E8] text-[#5C361D] text-xs"
            aria-label="Increase quantity"
            type="button"
          >
            +
          </button>
        </div>
        
        <button
          onClick={handleAddToCart}
          className="w-full bg-[#E8AC56] text-[#5C361D] py-1.5 rounded text-xs font-semibold hover:bg-[#D49A3E] transition-colors"
        >
          {added ? '✓' : '+'}
        </button>
      </div>
    </article>
  )
}
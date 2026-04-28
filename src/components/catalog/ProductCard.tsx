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
    <article className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="aspect-square bg-gray-100 relative">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBQYSIRMxQWH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABsRAAICAwEAAAAAAAAAAAAAAAECAAMEESFB/9oADAMBAAIRAxEAPwCvpGsWWo2kd3aXEc0Mg5RyRsGVh8gg4I/VQ1W/TTbS4W2s7iK3hQBYooYyiqPYAHAH6K5vS9XvdGvEvrC4eCZODxOP0HqD0QfcH4e6f7d6l1DVrT5TXdy1xcFseZ+x7k+wOwPsD7edI8msrI0pQ7R//2Q=="
        />
      </div>
      
      <div className="p-4 space-y-2">
        <span className="text-xs uppercase tracking-wide text-gray-500">
          {product.category}
        </span>
        
        <h3 className="font-playfair font-bold text-gray-900">
          {product.name}
        </h3>
        
        <p className="text-lg font-medium text-gray-900">
          {formatPrice(product.price)}
        </p>
        
        {abv && (
          <p className="text-sm text-gray-600">
            {abv} alcohol
          </p>
        )}
        
        {/* Quantity selector - 44px tap targets */}
        <div className="flex items-center gap-2 py-2">
          <button
            onClick={decrement}
            className="w-11 h-11 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 min-w-[44px]"
            aria-label="Decrease quantity"
            type="button"
          >
            −
          </button>
          
          <span className="w-8 text-center font-medium">
            {quantity}
          </span>
          
          <button
            onClick={increment}
            className="w-11 h-11 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 min-w-[44px]"
            aria-label="Increase quantity"
            type="button"
          >
            +
          </button>
        </div>
        
        <button
          onClick={handleAddToCart}
          className="w-full bg-gray-900 text-white py-3 rounded font-medium hover:bg-gray-800 transition-colors min-h-[44px]"
        >
          {added 
            ? `✓ Agregado (${quantity})` 
            : `Agregar al carrito (${quantity})`
          }
        </button>
      </div>
    </article>
  )
}
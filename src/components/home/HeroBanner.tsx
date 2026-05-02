'use client'

import Link from 'next/link'

export function HeroBanner() {
  return (
    <section 
      className="relative w-full py-12 md:py-16"
      style={{
        backgroundColor: '#243b29',
        // Blur effect hacia arriba usando mask
        maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h2 
              className="text-2xl md:text-3xl font-bold text-[#F2EBD1] mb-2"
              style={{ fontFamily: 'var(--font-alfa-slab), Georgia, serif' }}
            >
              ¿Listo para tu próximo pedido?
            </h2>
            <p className="text-[#A89076] text-sm md:text-base">
              Contáctanos directamente por WhatsApp para pedidos mayoristas y eventos especiales
            </p>
          </div>
          
          <Link
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[#25D366] text-white rounded-lg font-semibold hover:bg-[#128C7E] transition-colors inline-flex items-center gap-2"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.225-.751.867-.919.987-.168.12-.336.149-.67.074-.334-.074-1.413-.575-2.694-1.736-.658-.594-.972-1.166-.972-1.982v-.144c0-.816.919-1.584 1.002-1.699.099-.12.273-.374.497-.567.273-.237.497-.373.669-.373.198 0 .495.074.67.149.168.075.299.149.467.299.148.149.247.297.297.495.074.15-.025.297-.099.495l-.497 1.877c-.124.224-.371.496-.495.597-.124.124-.273.225-.595.225-.198 0-.495-.074-.752-.372-.267-.297-.497-.595-.745-.867-.224-.224-.447-.447-.595-.595-.124-.124-.249-.149-.495-.074l-.744-.372c-.124-.074-.297-.149-.495-.149h-1.127c-.124 0-.371.074-.495.149-.124.124-.495.495-.495.867 0 .595.495 1.277 1.002 1.729.742.743 1.556 1.229 2.406 1.729.272.149.495.249.669.347.174.099.298.149.495.149h.124c.124 0 .495-.074.867-.496l.745-.744c.149-.149.224-.297.297-.447.074-.149.074-.224.074-.42 0-.12-.025-.272-.099-.42z"/>
            </svg>
            Escribir WhatsApp
          </Link>
        </div>
      </div>
    </section>
  )
}
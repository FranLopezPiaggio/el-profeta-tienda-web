import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/home/Hero'
import { HeroBanner } from '@/components/home/HeroBanner'
import { ProductGrid } from '@/components/catalog/ProductGrid'
import productsData from '../../data/products.json' 

export default function HomePage() {
  const products = productsData.products

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <Hero />
        <HeroBanner />
        <section id="catalogo" className="py-16 px-4 max-w-6xl mx-auto product-grid relative z-20">
          <h2 className="text-xl md:text-7xl font-bold mb-4 font-serif font-serif text-3xl font-bold text-gray-900 mb-8"
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
          >Hace tu pedido...</h2>
          <ProductGrid products={products} animate={true} />
        </section>
      </main>
      <Footer />
    </>
  )
}
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/home/Hero'
import { AgeGate } from '@/components/gate/AgeGate'
import { ProductGrid } from '@/components/catalog/ProductGrid'
import productsData from '../../data/products.json' 

export default function HomePage() {
  const products = productsData.products

  return (
    <>
      <AgeGate />
      <Navbar />
      <main className="pt-16">
        <Hero />
        <section id="catalogo" className="py-16 px-4 max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-gray-900 mb-8">Nuestro Catálogo</h2>
          <ProductGrid products={products} />
        </section>
      </main>
      <Footer />
    </>
  )
}
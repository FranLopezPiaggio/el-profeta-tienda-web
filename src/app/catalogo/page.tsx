import { Navbar } from '@/components/layout/Navbar'
import { ProductGrid } from '@/components/catalog/ProductGrid'
import productsData from '../../../data/products.json'

export const metadata = {
  title: 'Catálogo | El Profeta',
  description: 'Explora nuestra selección de cervezas artesanales',
}

export default function CatalogPage() {
  const products = productsData.products

  return (
    <>
      <Navbar />
      <main className="pt-16 pb-4 min-h-screen flex flex-col">
        <div className="max-w-full mx-auto w-full flex-1 flex flex-col">
          <h1 className="font-[family-name:var(--font-alfa-slab)] text-xl sm:text-2xl md:text-3xl text-[#5C361D] px-3 py-2 text-center">
            Catálogo
          </h1>
          
          <div className="flex-1 overflow-auto product-grid">
            <ProductGrid products={products} animate={true} />
          </div>
        </div>
      </main>
    </>
  )
}
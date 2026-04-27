import { ProductGrid } from '@/components/catalog/ProductGrid'
import productsData from '@/data/products.json'

export const metadata = {
  title: 'Catálogo | El Profeta',
  description: 'Explora nuestra selección de cervezas artesanales',
}

export default function CatalogPage() {
  const products = productsData.products

  return (
    <main className="pt-24 pb-12 px-4 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-playfair text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          Nuestro Catálogo
        </h1>
        
        <ProductGrid products={products} />
      </div>
    </main>
  )
}
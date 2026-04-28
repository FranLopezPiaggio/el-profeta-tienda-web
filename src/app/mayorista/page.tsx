import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Venta Mayorista | El Profeta',
  description: 'Cerveza artesanal al por mayor. Precios especiales para bares, restaurantes y distribuidores.',
}

export default function MayoristaPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-12 min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gray-900 text-white py-20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/70 z-10" />
          </div>
          <div className="relative z-20 px-4 max-w-6xl mx-auto text-center">
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Venta Mayorista
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Llevá la mejor cerveza artesanal de Argentina a tu negocio. 
              Precios especiales para bares, restaurantes y distribuidores.
            </p>
            <Link
              href="/contacto"
              className="inline-block bg-white text-gray-900 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
            >
              Contactar
            </Link>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 px-4 max-w-6xl mx-auto">
          <h2 className="font-playfair text-3xl font-bold text-gray-900 text-center mb-12">
            ¿Por qué elegirnos?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                Precios Especiales
              </h3>
              <p className="text-gray-600">
                Descuentos por volumen adaptándose a las necesidades de tu negocio.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                Entrega Segura
              </h3>
              <p className="text-gray-600">
                Logística especializada para mantener la calidad de nuestros productos.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                Pedidos Mínimos
              </h3>
              <p className="text-gray-600">
                Mínimos flexibles adaptándose a negocios pequeños y grandes.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-playfair text-3xl font-bold text-gray-900 mb-4">
              ¿Listo para empezar?
            </h2>
            <p className="text-gray-600 mb-8">
              Escribinos y te armamos una propuesta personalizada para tu negocio.
            </p>
            <Link
              href="/contacto"
              className="inline-block bg-gray-900 text-white px-8 py-3 rounded-md font-medium hover:bg-gray-700 transition-colors"
            >
              Solicitar Cotización
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
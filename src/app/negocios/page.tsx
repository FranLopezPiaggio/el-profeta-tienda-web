import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Negocios & Empresas | El Profeta',
  description: 'Asociaciones estratégicas y soluciones empresariales con cerveza artesanal.',
}

export default function NegociosPage() {
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
              Negocios & Empresas
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Creá experiencias únicas para tus clientes y empleados con nuestra cerveza artesanal. 
              Desde eventos corporativos hasta regalos empresariales.
            </p>
            <Link
              href="/contacto"
              className="inline-block bg-white text-gray-900 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
            >
              Contactar
            </Link>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 px-4 max-w-6xl mx-auto">
          <h2 className="font-playfair text-3xl font-bold text-gray-900 text-center mb-12">
            Soluciones para Empresas
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-3">🎁</div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                Regalos Empresariales
              </h3>
              <p className="text-gray-600">
                Boxes corporativos con nuestra selección de cervezas artesanales para tus clientes y empleados.
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-3">🏢</div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                Eventos Corporativos
              </h3>
              <p className="text-gray-600">
                Catering de cerveza artesanal para presentaciones, celebraciones y reuniones de empresa.
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-3">🏷️</div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                Etiquetas Personalizadas
              </h3>
              <p className="text-gray-600">
                Cerveza con tu marca. Diseñamos etiquetas personalizadas para eventos especiales y promociones.
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-3">🍻</div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                Hamburgadas & Promo
              </h3>
              <p className="text-gray-600">
                Alianzas estratégicas para promociones conjuntas con restaurantes y eventos gastronómicos.
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-3">📰</div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                Sponsorings
              </h3>
              <p className="text-gray-600">
                Apoyamos eventos culturales, deportivos y musicales. Escribinos para explorar oportunidades.
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-3">🤝</div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                Distribuidores
              </h3>
              <p className="text-gray-600">
                Convertite en distribuidor oficial de El Profeta en tu zona. Te armamos una propuesta comercial.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-playfair text-3xl font-bold text-gray-900 mb-4">
              ¿Hablamos de negocios?
            </h2>
            <p className="text-gray-600 mb-8">
              Estamos siempre abiertos a nuevas alianzas. Escribinos y te respondemos lo antes posible.
            </p>
            <Link
              href="/contacto"
              className="inline-block bg-gray-900 text-white px-8 py-3 rounded-md font-medium hover:bg-gray-700 transition-colors"
            >
              Propón tu Idea
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
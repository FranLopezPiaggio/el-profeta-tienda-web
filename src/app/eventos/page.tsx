import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Eventos | El Profeta',
  description: 'Cerveza artesanal para eventos privados, fiestas y celebraciones.',
}

export default function EventosPage() {
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
              Eventos Privados
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Hacemos de tu celebration algo único. Birthday parties, bodas, eventos familiares 
              y celebraciones especiales con la mejor cerveza artesanal.
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
            ¿Qué podemos ofrecerte?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-3">🎂</div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                Fiestas de Cumpleaños
              </h3>
              <p className="text-gray-600">
                Desde生日 simples hasta fiestas temáticas. Te armamos un combo de cerveza para tu celebration.
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-3">💒</div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                Bodas & Casamientos
              </h3>
              <p className="text-gray-600">
                Sorprendé a tus invitados con una barra de cerveza artesanal. Opciones sin alcohol incluidas.
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-3">👨‍👩‍👧‍👦</div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                Eventos Familiares
              </h3>
              <p className="text-gray-600">
                Fechas patrias, reuniones familiares, comuniones y confirmaciones. Мы тебе поможем.
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-3">🎸</div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                Festivals & Concerts
              </h3>
              <p className="text-gray-600">
                Si estás organizando un evento abierto al público, podemos ser tu proveedor oficial de cerveza.
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-3">🏠</div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                Casa Particular
              </h3>
              <p className="text-gray-600">
                ¿Estás haciendo un asado o juntada en tu casa? Nosotros te llevamos la birra direktamente a tu puerta.
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-3">🍺</div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                Catas & Degustaciones
              </h3>
              <p className="text-gray-600">
                Organizamos experiencias de cata de cerveza artesanal para grupos. Ideal para team buildings.
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-playfair text-3xl font-bold text-gray-900 text-center mb-12">
              ¿Cómo funciona?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                  1
                </div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Contactanos
                </h3>
                <p className="text-sm text-gray-600">
                  Escribinos con los detalles de tu evento: fecha, cantidad de invitados, lugar.
                </p>
              </div>

              <div className="text-center">
                <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                  2
                </div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Te Cotizamos
                </h3>
                <p className="text-sm text-gray-600">
                  Te mandamos una propuesta con opciones según tu presupuesto y necesidades.
                </p>
              </div>

              <div className="text-center">
                <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                  3
                </div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Disfrutá
                </h3>
                <p className="text-sm text-gray-600">
                  Nosotros te llevamos todo a tu evento. Vos disfrute avec vos invités.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-playfair text-3xl font-bold text-gray-900 mb-4">
              ¿Cuándo es tu próximo evento?
            </h2>
            <p className="text-gray-600 mb-8">
              Cuéntanos qué tenés en mente y te ayudamos a hacerlo realidad.
            </p>
            <Link
              href="/contacto"
              className="inline-block bg-gray-900 text-white px-8 py-3 rounded-md font-medium hover:bg-gray-700 transition-colors"
            >
              Solicitar Info
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
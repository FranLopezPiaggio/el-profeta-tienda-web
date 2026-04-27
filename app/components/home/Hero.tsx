import Link from 'next/link'

export function Hero() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-white">
      <div className="text-center px-4 max-w-2xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
          Cerveza artesanal de calidad
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 font-sans">
          Descubre nuestras cervezas artesanales
        </p>
        <Link
          href="/catalogo"
          className="inline-block bg-gray-900 text-white px-8 py-3 rounded font-medium hover:bg-gray-800 transition-colors min-h-[44px] flex items-center justify-center"
        >
          Ver Catálogo
        </Link>
      </div>
    </section>
  )
}
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <p className="font-serif text-xl font-bold text-gray-900 mb-2">
              El Profeta
            </p>
            <p className="text-sm text-gray-500">
              Cerveza artesanal de calidad
            </p>
          </div>

          {/* Explore Column */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Explorar
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/catalogo" className="text-sm text-gray-600 hover:text-gray-900">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link href="/mayorista" className="text-sm text-gray-600 hover:text-gray-900">
                  Mayorista
                </Link>
              </li>
              <li>
                <Link href="/negocios" className="text-sm text-gray-600 hover:text-gray-900">
                  Negocios
                </Link>
              </li>
              <li>
                <Link href="/eventos" className="text-sm text-gray-600 hover:text-gray-900">
                  Eventos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Contacto
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contacto" className="text-sm text-gray-600 hover:text-gray-900">
                  Contactar
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/5492324511751"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-gray-600">
                  © 2026 El Profeta
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
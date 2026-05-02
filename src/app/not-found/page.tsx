import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <h1 className="font-serif text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-gray-600 text-lg mb-8">Página no encontrada</p>
      <Link 
        href="/"
        className="bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
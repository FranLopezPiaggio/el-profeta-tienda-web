'use client'

import { useState, FormEvent } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Send } from 'lucide-react'

const WHATSAPP_PHONE = '5492324511751'

interface FormData {
  nombre: string
  email: string
  telefono: string
  tipoConsulta: string
  mensaje: string
}

const tiposConsulta = [
  { value: '', label: 'Selecciona una opción' },
  { value: 'general', label: 'General' },
  { value: 'mayorista', label: 'Venta Mayorista' },
  { value: 'negocios', label: 'Negocios / Empresas' },
  { value: 'eventos', label: 'Eventos Privados' },
]

export default function ContactoPage() {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    telefono: '',
    tipoConsulta: '',
    mensaje: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingresá un email válido'
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio'
    }

    if (!formData.tipoConsulta) {
      newErrors.tipoConsulta = 'Seleccioná un tipo de consulta'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Generate WhatsApp message
    const tipoLabel = tiposConsulta.find(t => t.value === formData.tipoConsulta)?.label || formData.tipoConsulta

    const message = `*Nueva consulta desde la web*

*Nombre:* ${formData.nombre}
*Email:* ${formData.email}
*Teléfono:* ${formData.telefono}
*Tipo de consulta:* ${tipoLabel}

*Mensaje:*
${formData.mensaje.trim() || '(Sin mensaje)'}
`
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`

    // Open WhatsApp
    window.open(whatsappUrl, '_blank')
    setIsSubmitting(false)
  }

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-12 min-h-screen">
        {/* Hero Section */}
        <section className="py-12 px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Contactanos
            </h1>
            <p className="text-lg text-gray-600">
              ¿Tenés alguna pregunta? ¿Querés hacer un pedido mayorista? 
              ¿Organizás un evento? Escribinos y te respondemos rápidamente por WhatsApp.
            </p>
          </div>
        </section>

        {/* Form Section */}
        <section className="px-4 max-w-xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-900 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                  errors.nombre ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Tu nombre completo"
              />
              {errors.nombre && (
                <p className="mt-1 text-sm text-red-500">{errors.nombre}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1">
                Email *
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="tu@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-900 mb-1">
                Teléfono *
              </label>
              <input
                type="tel"
                id="telefono"
                value={formData.telefono}
                onChange={(e) => handleChange('telefono', e.target.value)}
                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                  errors.telefono ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="11 1234 5678"
              />
              {errors.telefono && (
                <p className="mt-1 text-sm text-red-500">{errors.telefono}</p>
              )}
            </div>

            {/* Tipo de Consulta */}
            <div>
              <label htmlFor="tipoConsulta" className="block text-sm font-medium text-gray-900 mb-1">
                Tipo de consulta *
              </label>
              <select
                id="tipoConsulta"
                value={formData.tipoConsulta}
                onChange={(e) => handleChange('tipoConsulta', e.target.value)}
                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                  errors.tipoConsulta ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {tiposConsulta.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.tipoConsulta && (
                <p className="mt-1 text-sm text-red-500">{errors.tipoConsulta}</p>
              )}
            </div>

            {/* Mensaje */}
            <div>
              <label htmlFor="mensaje" className="block text-sm font-medium text-gray-900 mb-1">
                Mensaje (opcional)
              </label>
              <textarea
                id="mensaje"
                value={formData.mensaje}
                onChange={(e) => handleChange('mensaje', e.target.value)}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="Contános más sobre tu consulta..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gray-900 text-white py-3 px-6 rounded-md font-medium hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
              {isSubmitting ? 'Enviando...' : 'Enviar por WhatsApp'}
            </button>
          </form>
        </section>

        {/* Info Section */}
        <section className="px-4 py-12 max-w-3xl mx-auto">
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <h2 className="font-semibold text-lg text-gray-900 mb-2">
              Otras formas de contactarnos
            </h2>
            <p className="text-gray-600 mb-4">
              También podés escribirnos directamente por WhatsApp:
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_PHONE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-500 text-white px-6 py-2 rounded-md font-medium hover:bg-green-600 transition-colors"
            >
              Abrir WhatsApp
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
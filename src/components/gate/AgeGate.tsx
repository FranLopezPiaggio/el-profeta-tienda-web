'use client'

import { useState, useEffect } from 'react'

const AGE_KEY = 'el-profeta-age-confirmed'

export function AgeGate() {
  const [confirmed, setConfirmed] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(AGE_KEY)
    if (stored === 'true') {
      setConfirmed(true)
    }
    setChecked(true)
  }, [])

  const handleConfirm = () => {
    localStorage.setItem(AGE_KEY, 'true')
    setConfirmed(true)
  }

  if (!checked) return null
  if (confirmed) return null

  return (
    <div className="fixed top-0 left-0 right-0 bg-gray-900 text-white py-1 z-[60]">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <p className="text-sm">
          Debes tener 18+ a&ntilde;os para ingresar a esta tienda.
        </p>
        <button
          onClick={handleConfirm}
          className="bg-white text-gray-900 px-4 py-2 rounded text-sm font-medium hover:bg-gray-100 transition-colors min-h-[44px]"
        >
          Confirmo que soy mayor de 18 a&ntilde;os
        </button>
      </div>
    </div>
  )
}
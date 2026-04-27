/**
 * Utility functions for El Profeta store
 * Includes WhatsApp message encoding and price formatting
 */

/**
 * Encodes text for use in WhatsApp wa.me links
 * Handles Unicode characters (ñ, á, é, í, ó, ú) properly
 */
export function encodeWhatsAppMessage(text: string): string {
  // Replace newlines with %0A (required for WhatsApp)
  // Encode all Unicode characters for cross-platform compatibility
  return encodeURIComponent(text)
    .replace(/%0A/g, '%0A') // Preserve line breaks
    .replace(/%20/g, '+')   // Spaces as + for cleaner URLs
}

/**
 * Generates WhatsApp wa.me URL with pre-filled message
 */
export function generateWhatsAppLink(
  phone: string, 
  message: string
): string {
  const cleanPhone = phone.replace(/\D/g, '') // Remove non-digits
  const encodedMessage = encodeWhatsAppMessage(message)
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
}

/**
 * Formats price with Argentine peso symbol
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0
  }).format(price)
}

/**
 * Validates Argentine phone number format
 * Accepts: 5491112345678, +5491112345678, 1112345678
 */
export function isValidArgentinianPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  // Mobile: 54 + 9 + area code (2-4 digits) + number (6-8 digits)
  // Total: 10-13 digits after removing country code
  const validPatterns = [
    /^549\d{10,13}$/,  // With country code 54, includes 9
    /^54\d{9,12}$/,     // Without 9
    /^\d{10,13}$/       // Just digits
  ]
  return validPatterns.some(pattern => pattern.test(cleaned))
}

/**
 * Formats phone for display
 */
export function formatPhoneForDisplay(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('54') && cleaned.length > 2) {
    const withoutCountry = cleaned.slice(2)
    if (withoutCountry.startsWith('9')) {
      return `+54 9 ${withoutCountry.slice(1).slice(0, 2)} ${withoutCountry.slice(3)}`
    }
    return `+54 ${withoutCountry.slice(0, 2)} ${withoutCountry.slice(2)}`
  }
  return phone
}
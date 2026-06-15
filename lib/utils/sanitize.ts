/** Kullanıcı girdisinden tehlikeli karakterleri temizler (XSS önlemi) */
export function sanitizeInput(input: string, maxLength = 500): string {
  return input
    .slice(0, maxLength)
    .replace(/[<>{}\\]/g, '')
    .trim()
}

/** Slug formatına dönüştürür */
export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

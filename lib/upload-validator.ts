const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE      = 5 * 1024 * 1024 // 5MB

export const MAX_FILES_PER_REQUEST = 5

export function validateUpload(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Sadece JPEG, PNG, WebP ve GIF destekleniyor'
  }
  if (file.size > MAX_SIZE) {
    return 'Dosya boyutu 5MB\'ı geçemez'
  }
  return null
}

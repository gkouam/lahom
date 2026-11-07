// Phone photos are often 5–12 MB, but a Vercel function accepts at most
// 4.5 MB per request. Before uploading, large photos are resized in the
// browser to at most 2400 px on the long side and saved as JPEG, which brings
// a typical phone photo under 1 MB with no visible loss on the website.

export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024
const MAX_EDGE = 2400
const SHRINK_ABOVE_BYTES = 1.5 * 1024 * 1024

export async function shrinkImageForUpload(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) return file
  try {
    const bitmap = await createImageBitmap(file)
    const longEdge = Math.max(bitmap.width, bitmap.height)
    if (file.size <= SHRINK_ABOVE_BYTES && longEdge <= MAX_EDGE) {
      bitmap.close()
      return file
    }
    const scale = Math.min(1, MAX_EDGE / longEdge)
    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) { bitmap.close(); return file }
    ctx.drawImage(bitmap, 0, 0, width, height)
    bitmap.close()
    const blob: Blob | null = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.85))
    if (!blob || blob.size >= file.size) return file
    const name = file.name.replace(/\.[^.]+$/, '') + '.jpg'
    return new File([blob], name, { type: 'image/jpeg' })
  } catch {
    // Formats the browser can't decode (for example some HEIC files) are sent
    // as they are; the size check below the caller explains if it's too big.
    return file
  }
}

export function tooLargeMessage(bytes: number): string {
  const mb = (bytes / (1024 * 1024)).toFixed(1)
  return `This photo is ${mb} MB after resizing. Photos must be 4 MB or smaller; try a smaller copy or a screenshot of it.`
}

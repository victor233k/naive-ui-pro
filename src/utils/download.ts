/**
 * 从URL中提取文件名
 * @param url URL地址
 */
export function getFilenameFromUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    const filename = pathname.split('/').pop()
    return filename || 'download'
  }
  catch {
    return 'download'
  }
}

/**
 * 通用的Blob下载函数
 * @param blob Blob对象
 * @param filename 文件名
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const downloadUrl = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = downloadUrl
  link.download = filename
  link.setAttribute('target', '_blank')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(downloadUrl)
}

/**
 * 判断是否为外部URL
 * @param url URL地址
 */
export function isExternalUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    const currentOrigin = window.location.origin
    return urlObj.origin !== currentOrigin
  }
  catch {
    return true
  }
}

/**
 * 地址
 * @param url
 */
export function urlToBase64(url: string, mineType?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let canvas = document.createElement('CANVAS') as HTMLCanvasElement | null
    const ctx = canvas?.getContext('2d')
    const img = new Image()
    img.crossOrigin = ''
    img.addEventListener('load', () => {
      if (!canvas || !ctx) {
        return reject(new Error('Failed to create canvas.'))
      }
      canvas.height = img.height
      canvas.width = img.width
      ctx.drawImage(img, 0, 0)
      const dataURL = canvas.toDataURL(mineType || 'image/png')
      canvas = null
      resolve(dataURL)
    })
    img.src = url
  })
}

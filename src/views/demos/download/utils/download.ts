import { $t } from '@/locales/locales'
import http from '@/utils/axios'

/**
 * 从URL中提取文件名
 * @param url URL地址
 */
function getFilenameFromUrl(url: string): string {
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
function downloadBlob(blob: Blob, filename: string): void {
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
function isExternalUrl(url: string): boolean {
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

/**
 * 根据URL下载文件
 * @param url 文件URL
 * @param filename 文件名（可选）
 */
export async function downloadFileFromUrl(url: string, filename?: string): Promise<void> {
  try {
    if (isExternalUrl(url)) {
      window.open(url, '_self')
    }
    else {
      // 对于内部API，使用axios
      const response = await http.get(url, {
        responseType: 'blob',
      })
      const blob = response.data
      const finalFilename = filename || getFilenameFromUrl(url) || 'download'
      downloadBlob(blob, finalFilename)
    }
  }
  catch (error) {
    console.error($t('pages.demos.download.downloadFileFailed'), error)
    throw error
  }
}

/**
 * 下载图片
 * @param imageUrl 图片URL
 * @param filename 文件名（可选）
 */
export async function downloadImage(imageUrl: string, filename?: string): Promise<void> {
  try {
    const base64 = await urlToBase64(imageUrl)
    const finalFilename = filename || getFilenameFromUrl(imageUrl) || 'image.png'
    downloadBase64(base64, finalFilename, 'image/png')
  }
  catch (error) {
    console.error($t('pages.demos.download.downloadImageFailed'), error)
    throw error
  }
}

/**
 * 下载文本内容
 * @param content 文本内容
 * @param filename 文件名
 * @param mimeType MIME类型
 */
export function downloadText(
  content: string,
  filename: string = 'download.txt',
  mimeType: string = 'text/plain;charset=utf-8',
): void {
  try {
    const blob = new Blob([content], { type: mimeType })
    downloadBlob(blob, filename)
  }
  catch (error) {
    console.error($t('pages.demos.download.downloadTextFailed'), error)
    throw error
  }
}

/**
 * 下载base64数据
 * @param base64Data base64字符串
 * @param filename 文件名
 * @param mimeType MIME类型
 */
export function downloadBase64(
  base64Data: string,
  filename: string = 'download',
  mimeType: string = 'image/png',
): void {
  try {
    // 移除base64前缀（如果存在）
    const base64 = base64Data.includes('base64,')
      ? base64Data.split('base64,')[1]
      : base64Data

    const byteCharacters = atob(base64)
    const byteNumbers = Array.from({ length: byteCharacters.length }, (_, i) =>
      byteCharacters.charCodeAt(i))

    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: mimeType })
    downloadBlob(blob, filename)
  }
  catch (error) {
    console.error($t('pages.demos.download.downloadBase64Failed'), error)
    throw error
  }
}

/**
 * 获取Blob对象
 * @param url 请求URL
 * @param options 请求选项
 */
export async function getBlob(url: string, options?: any): Promise<Blob> {
  try {
    const response = await http.get(url, {
      responseType: 'blob',
      ...options,
    })
    return response.data
  }
  catch (error) {
    console.error($t('pages.demos.download.getBlobFailed'), error)
    throw error
  }
}

/**
 * 获取Response对象
 * @param url 请求URL
 * @param options 请求选项
 */
export async function getResponse(url: string, options?: any): Promise<any> {
  try {
    return await http.get(url, {
      responseType: 'blob',
      ...options,
    })
  }
  catch (error) {
    console.error($t('pages.demos.download.getResponseFailed'), error)
    throw error
  }
}

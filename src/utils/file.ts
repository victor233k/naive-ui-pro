import type { AxiosRequestConfig } from 'axios'
import http from './axios'

/**
 * 从 url 中提取文件名
 */
export function getFilenameFromUrl(url: string, fallback = 'download'): string {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    const filename = pathname.split('/').pop()
    return filename || fallback
  }
  catch {
    return fallback
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
 * url 转 base64
 */
export function urlToBase64(url: string, mineType?: string) {
  return new Promise<string>((resolve, reject) => {
    let canvas = document.createElement('canvas') as HTMLCanvasElement | null
    const ctx = canvas?.getContext('2d')
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      if (!canvas || !ctx) {
        return reject(new Error('Failed to create canvas.'))
      }
      canvas.height = img.height
      canvas.width = img.width
      ctx.drawImage(img, 0, 0, img.width, img.height)
      const dataURL = canvas.toDataURL(mineType || 'image/png')
      canvas = null
      resolve(dataURL)
    }
    img.onerror = () => {
      reject(new Error('Failed to load image.'))
    }
    img.src = url
  })
}

/**
 * 根据 url 下载文件
 * @param url 文件URL
 * @param filename 文件名（可选）
 */
export function downloadFileFromUrl(url: string, filename?: string): Promise<void> {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<void>(async (resolve, reject) => {
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
        const finalFilename = filename ?? getFilenameFromUrl(url)
        downloadBlob(blob, finalFilename)
        resolve()
      }
    }
    catch (error) {
      reject(error)
    }
  })
}

/**
 * 下载图片
 * @param imageUrl 图片URL
 * @param filename 文件名（可选）
 */
export function downloadImage(imageUrl: string, filename?: string) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<void>(async (resolve, reject) => {
    try {
      const base64 = await urlToBase64(imageUrl)
      const finalFilename = filename ?? getFilenameFromUrl(imageUrl)
      downloadBase64(base64, finalFilename, 'image/png')
      resolve()
    }
    catch (error) {
      reject(error)
    }
  })
}

/**
 * 下载文本内容
 * @param content 文本内容
 * @param filename 文件名
 * @param mimeType MIME类型
 */
export function downloadText(
  content: string,
  filename = 'download.txt',
  mimeType = 'text/plain;charset=utf-8',
) {
  return new Promise<void>((resolve, reject) => {
    try {
      const blob = new Blob([content], { type: mimeType })
      downloadBlob(blob, filename)
      resolve()
    }
    catch (error) {
      reject(error)
    }
  })
}

/**
 * 下载base64数据
 * @param base64Data base64字符串
 * @param filename 文件名
 * @param mimeType MIME类型
 */
export function downloadBase64(
  base64Data: string,
  filename = 'download',
  mimeType = 'image/png',
) {
  return new Promise<void>((resolve, reject) => {
    try {
      const base64 = base64Data.includes('base64,')
        ? base64Data.split('base64,')[1]
        : base64Data

      const byteCharacters = atob(base64)
      const byteNumbers = Array.from({ length: byteCharacters.length }, (_, i) => byteCharacters.charCodeAt(i))
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: mimeType })
      downloadBlob(blob, filename)
      resolve()
    }
    catch (error) {
      reject(error)
    }
  })
}

/**
 * 请求获取 blob response 对象
 * @param url 请求URL
 * @param options 请求选项
 */
export function fetchBlobResponse<T = any>(url: string, axiosRequestConfig: AxiosRequestConfig = {}) {
  return http.get<T>(url, {
    responseType: 'blob',
    ...axiosRequestConfig,
  })
}

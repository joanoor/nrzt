/**
 * 关于base64,参见：https://developer.mozilla.org/zh-CN/docs/Glossary/Base64
 * Base64 是一组相似的二进制到文本（binary-to-text）的编码规则，使得二进制数据在解释成 radix-64 的表现形式后能够用 ASCII 字符串的格式表示出来
 *
 * 关于Blob，参见：https://developer.mozilla.org/zh-CN/docs/Web/API/Blob
 * Blob 对象表示一个不可变、原始数据的类文件对象。它的数据可以按文本或二进制的格式进行读取，也可以转换成 ReadableStream 来用于数据操作
 *
 * 关于FileReader，参见：https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader
 *
 *
 * 几个名词：
 * dataUrl 表示 base64或者url链接
 * imgUrl 表示 图片的Url链接
 * base64 表示 base64
 * Blob 表示类文件对象
 * File 表示文件（二进制或文本文件）
 *
 */

import { read, WorkBook } from 'xlsx'

/**
 * base64转成Blob
 */
export function base64ToBlob(base64Buf: string): Blob {
  const arr = base64Buf.split(',')
  const typeItem = arr[0]
  const mime = typeItem.match(/:(.*?);/)![1]
  const bstr = window.atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

/**
 * base64或者url链接转成图片
 */
export const dataUrl2Image = (dataUrl: string): Promise<HTMLImageElement> => {
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.src = dataUrl
  })
}

/**
 * Blob或File（因为File继承Blob，相当于Blob的子类）转成base64
 */
export const blob2Base64 = (file: Blob): Promise<any> => {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.onloadend = e => resolve((e.target as FileReader).result)
    reader.readAsDataURL(file) // 开始读取指定的Blob中的内容。一旦完成，result属性中将包含一个data: URL 格式的 Base64 字符串以表示所读取文件的内容。
  })
}

/**
 * canvas转成Blob
 */
export const canvas2Blob = (
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
) => {
  return new Promise(resolve =>
    canvas.toBlob(blob => resolve(blob), type, quality)
  )
}

/**
 * 压缩图片File
 * @param file 上传的文件
 * @param quality 压缩质量
 * @param threshold 压缩阈值，超过则压缩，否则不压缩
 */
export const compressionPicture = async (
  file: File,
  quality = 0.5,
  threshold = 100 * 1024
) => {
  console.log('文件的大小', file)
  if (file.size > threshold) {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d') as CanvasRenderingContext2D
    const base64 = await blob2Base64(file)
    const img = await dataUrl2Image(base64 as string)
    canvas.width = img.width
    canvas.height = img.height
    context.clearRect(0, 0, img.width, img.height)
    context.drawImage(img, 0, 0, img.width, img.height)
    const blob = (await canvas2Blob(canvas, file.type, quality)) as Blob
    return blob
  } else {
    return file
  }
}

/**
 * 通过图片链接转换成base64
 * @param url
 */
export function imgUrl2Base64(url: string, mineType?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement(
      'CANVAS'
    ) as Nullable<HTMLCanvasElement>
    const context = canvas!.getContext('2d')

    const img = new Image()
    img.crossOrigin = ''
    img.onload = async function () {
      if (!canvas || !context) {
        return reject()
      }
      canvas.height = img.height
      canvas.width = img.width
      context.drawImage(img, 0, 0, img.width, img.height)
      const dataURL = canvas.toDataURL(mineType || 'image/png') // 生成base64
      resolve(dataURL)
    }
    img.src = url
  })
}

/**
 * 将base64转换成url链接
 * @param {*} data base64数据
 */
export function base64ToImgUrl(data: string) {
  const blobData = [data]
  const blob = new Blob(blobData, {
    type: 'application/octet-stream',
  })
  const link = URL.createObjectURL(blob)

  return link.split('blob:')[1]
}

/**
 * 将excel Blob文件转换成json
 * @param rawFile
 * @param callback
 */
export function excelBlob2Json(
  fileBlob: Blob,
  callback: (data: WorkBook) => void
) {
  const fileReader = new FileReader()
  fileReader.readAsBinaryString(fileBlob)
  fileReader.onload = async ev => {
    const blobData = ev?.target?.result
    const workbook = read(blobData, {
      type: 'binary',
    })
    await callback(workbook)
  }
}

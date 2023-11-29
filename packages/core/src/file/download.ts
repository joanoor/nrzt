import { openWindow } from '../utils'
import { base64ToBlob, imgUrl2Base64 } from './convertFile'
import { utils, WorkBook, write, XLSX$Utils } from 'xlsx'

interface DownloadOption {
  afterDownload?: () => void
  mime?: string
  bom?: BlobPart
}

// 将字符串转ArrayBuffer
function s2ab(s: any) {
  const buf = new ArrayBuffer(s.length)
  const view = new Uint8Array(buf)
  for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
  return buf
}

function workbook2blob(workbook: WorkBook) {
  const wbout = write(workbook, {
    // 要生成的文件类型
    bookType: 'xlsx',
    // // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
    bookSST: false,
    type: 'binary',
  })

  const blob = new Blob([s2ab(wbout)], {
    type: 'application/octet-stream',
  })
  return blob
}

function download(blobUrl: string, fileName: string) {
  const aLink = document.createElement('a')
  aLink.href = blobUrl
  // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，有时候 file:///模式下不会生效
  aLink.download = fileName || ''
  let event: MouseEvent
  if (window.MouseEvent) event = new MouseEvent('click')
  //   移动端
  else {
    event = document.createEvent('MouseEvents')
    event.initMouseEvent(
      'click',
      true,
      false,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null
    )
  }
  aLink.dispatchEvent(event)
}

/**
 * 通过图片的在线地址下载图片
 * @param url
 * @param filename
 * @param mime
 * @param bom
 */
export function downloadByImgUrl(
  url: string,
  filename: string,
  option: DownloadOption = {}
) {
  const { afterDownload, mime, bom } = option
  imgUrl2Base64(url).then(base64 => {
    downloadByBase64(base64, filename, {
      mime,
      bom,
      afterDownload,
    })
  })
}

/**
 * 通过base64下载文件
 * @param buf
 * @param filename
 * @param mime
 * @param bom
 */
export function downloadByBase64(
  buf: string,
  filename: string,
  option: DownloadOption = {}
) {
  const { afterDownload, mime, bom } = option

  const base64Buf = base64ToBlob(buf)
  downloadByBlobData(base64Buf, filename, {
    mime,
    bom,
    afterDownload,
  })
}

/**
 * Download according to the background interface file stream
 * @param {*} data
 * @param {*} filename
 * @param {*} mime
 * @param {*} bom
 */
export function downloadByBlobData(
  data: BlobPart,
  filename: string,
  option: DownloadOption = {}
) {
  const { mime, bom, afterDownload } = option
  let blobURL = ''
  if (typeof data == 'object' && data instanceof Blob) {
    blobURL = URL.createObjectURL(data) // 创建blob地址
  } else {
    const blobData = typeof bom !== 'undefined' ? [bom, data] : [data]
    const blob = new Blob(blobData, {
      type: mime || 'application/octet-stream',
    })
    blobURL = URL.createObjectURL(blob)
  }
  download(blobURL, filename)
  afterDownload && afterDownload()
}

/**
 * 通过链接下载文件
 * @param {*} sUrl
 */
export function downloadByFileUrl({
  url,
  target = '_blank',
  fileName,
}: {
  url: string
  target?: TargetContext
  fileName?: string
}): boolean {
  const isChrome =
    window.navigator.userAgent.toLowerCase().indexOf('chrome') > -1
  const isSafari =
    window.navigator.userAgent.toLowerCase().indexOf('safari') > -1

  if (/(iP)/g.test(window.navigator.userAgent)) {
    console.error('Your browser does not support download!')
    return false
  }
  if (isChrome || isSafari) {
    const link = document.createElement('a')
    link.href = url
    link.target = target

    if (link.download !== undefined) {
      link.download =
        fileName || url.substring(url.lastIndexOf('/') + 1, url.length)
    }

    if (document.createEvent) {
      const e = document.createEvent('MouseEvents')
      e.initEvent('click', true, true)
      link.dispatchEvent(e)
      return true
    }
  }
  if (url.indexOf('?') === -1) {
    url += '?download'
  }

  openWindow(url, { target })
  return true
}

/**
 * 通过后端返回的json数据来下载excel(需要注意的是，导出全部数据时，数据量较大)
 * @param data
 * @param fileName 文件名称
 * @param option 选项
 * @param option.onBefore - The name of the employee.
 * @param option.department - The employee's department.
 * @returns
 */
export function downloadByJson<T extends any[]>(
  data: T,
  fileName: string,
  option: {
    beforeDownload?: (data: T, wb: WorkBook, utils: XLSX$Utils) => T
    afterDownload?: () => void
  } = {}
) {
  if (!data || data.length === 0) return
  const { beforeDownload, afterDownload } = option

  const wb = utils.book_new()
  if (!beforeDownload) {
    // 默认的sheet
    utils.book_append_sheet(wb, utils.json_to_sheet(data), 'sheet1')
  } else {
    // 自定义的sheet
    beforeDownload(data, wb, utils)
  }

  const workbookBlob = workbook2blob(wb)

  downloadByBlobData(workbookBlob, fileName + '.xlsx', {
    afterDownload,
  })
}

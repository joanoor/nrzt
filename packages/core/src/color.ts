import { isHexColor, isNumber } from '..'

/**
 * Generates a random hexadecimal color code
 * 生成随机的十六进制颜色代码
 * @returns {string}
 */
export function randomHexColorCode() {
  const n = (Math.random() * 0xfffff * 1000000).toString(16)
  return '#' + n.slice(0, 6)
}

/**
 * Converts a color code to an rgb() or rgba() string if alpha value is provided
 * @param hex
 * @returns
 */
export function hexToRGB(hex: string) {
  let alpha = false
  let h: string = hex.slice(hex.startsWith('#') ? 1 : 0)
  if (h.length === 3) {
    const pattern = /^[A-Fa-f0-9]{3}$/
    if (!pattern.test(h)) throw new Error('输入的参数不符合16进制颜色')
    else h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
  } else if (h.length === 6) {
    const pattern = /^[A-Fa-f0-9]{6}$/
    if (!pattern.test(h)) throw new Error('输入的参数不符合16进制颜色')
  } else if (h.length === 8) {
    const pattern = /^[A-Fa-f0-9]{8}$/
    if (!pattern.test(h)) throw new Error('输入的参数不符合16进制颜色')
    else alpha = true
  } else {
    throw new Error('输入的参数不符合16进制颜色')
  }
  const n = parseInt(h, 16)
  return (
    'rgb' +
    (alpha ? 'a' : '') +
    '(' +
    (n >>> (alpha ? 24 : 16)) +
    ', ' +
    ((n & (alpha ? 0x00ff0000 : 0x00ff00)) >>> (alpha ? 16 : 8)) +
    ', ' +
    ((n & (alpha ? 0x0000ff00 : 0x0000ff)) >>> (alpha ? 8 : 0)) +
    (alpha ? `, ${n & 0x000000ff}` : '') +
    ')'
  )
}

/**
 * Converts the values of RGB components to a hexadecimal color code
 * @param r
 * @param g
 * @param b
 * @returns
 */
export function rgbToHex(r: string): string
export function rgbToHex(r: number, g: number, b: number): string
export function rgbToHex(r: string | number, g?: number, b?: number) {
  if (isNumber(r)) {
    if (g && b) {
      if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
        return `#${((r << 16) + (g << 8) + b).toString(16).padStart(6, '0')}`
      } else {
        throw new Error('非法的rgb颜色')
      }
    }
  } else {
    const result = r.match(/(?<=rgb\()(\d+),(\d+),(\d+)(?=\))/)
    if (result) {
      return rgbToHex(
        parseInt(result[1]),
        parseInt(result[2]),
        parseInt(result[3])
      )
    } else {
      throw new Error('非法的rgb颜色')
    }
  }
}

export function colorIsDark(color: string) {
  if (!isHexColor(color)) return
  const [r, g, b] = hexToRGB(color)
    .replace(/(?:\(|\)|rgb|RGB)*/g, '')
    .split(',')
    .map(item => Number(item))
  return r * 0.299 + g * 0.578 + b * 0.114 < 192
}

/**
 * Darkens a HEX color given the passed percentage
 * @param {string} color The color to process
 * @param {number} amount The amount to change the color by
 * @returns {string} The HEX representation of the processed color
 */
export function darken(color: string, amount: number) {
  color = color.indexOf('#') >= 0 ? color.substring(1, color.length) : color
  amount = Math.trunc((255 * amount) / 100)
  return `#${subtractLight(color.substring(0, 2), amount)}${subtractLight(
    color.substring(2, 4),
    amount
  )}${subtractLight(color.substring(4, 6), amount)}`
}

/**
 * Lightens a 6 char HEX color according to the passed percentage
 * @param {string} color The color to change
 * @param {number} amount The amount to change the color by
 * @returns {string} The processed color represented as HEX
 */
export function lighten(color: string, amount: number) {
  color = color.indexOf('#') >= 0 ? color.substring(1, color.length) : color
  amount = Math.trunc((255 * amount) / 100)
  return `#${addLight(color.substring(0, 2), amount)}${addLight(
    color.substring(2, 4),
    amount
  )}${addLight(color.substring(4, 6), amount)}`
}

/* Suma el porcentaje indicado a un color (RR, GG o BB) hexadecimal para aclararlo */
/**
 * Sums the passed percentage to the R, G or B of a HEX color
 * @param {string} color The color to change
 * @param {number} amount The amount to change the color by
 * @returns {string} The processed part of the color
 */
function addLight(color: string, amount: number) {
  const cc = parseInt(color, 16) + amount
  const c = cc > 255 ? 255 : cc
  return c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`
}

/**
 * Calculates luminance of an rgb color
 * @param {number} r red
 * @param {number} g green
 * @param {number} b blue
 */
function luminanace(r: number, g: number, b: number) {
  const a = [r, g, b].map(v => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
}

/**
 * Calculates contrast between two rgb colors
 * @param {string} rgb1 rgb color 1
 * @param {string} rgb2 rgb color 2
 */
function contrast(rgb1: string[], rgb2: number[]) {
  return (
    (luminanace(~~rgb1[0], ~~rgb1[1], ~~rgb1[2]) + 0.05) /
    (luminanace(rgb2[0], rgb2[1], rgb2[2]) + 0.05)
  )
}

/**
 * Determines what the best text color is (black or white) based con the contrast with the background
 * @param hexColor - Last selected color by the user
 */
export function calculateBestTextColor(hexColor: string) {
  const rgbColor = hexToRGB(hexColor.substring(1))
  const contrastWithBlack = contrast(rgbColor.split(','), [0, 0, 0])

  return contrastWithBlack >= 12 ? '#000000' : '#FFFFFF'
}

/**
 * Subtracts the indicated percentage to the R, G or B of a HEX color
 * @param {string} color The color to change
 * @param {number} amount The amount to change the color by
 * @returns {string} The processed part of the color
 */
function subtractLight(color: string, amount: number) {
  const cc = parseInt(color, 16) - amount
  const c = cc < 0 ? 0 : cc
  return c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`
}

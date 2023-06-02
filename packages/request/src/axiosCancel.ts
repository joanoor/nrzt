import type { AxiosRequestConfig } from 'axios'

export let pendingMap = new Map<string, AbortController>()

export const getPendingUrl = (config: AxiosRequestConfig) =>
  [config.method, config.url].join('&')

export class AxiosCanceler {
  addPending(config: AxiosRequestConfig) {
    this.removePending(config) // 重复的请求，则取消上一次请求
    const pendingUrl = getPendingUrl(config)
    const controller = new AbortController()
    config.signal = config.signal || controller.signal
    if (!pendingMap.has(pendingUrl)) {
      pendingMap.set(pendingUrl, controller)
    }
  }

  removeAllPending() {
    pendingMap.forEach(controller => {
      controller && controller.abort()
    })
    pendingMap.clear()
  }

  removePending(config: AxiosRequestConfig) {
    const pendingUrl = getPendingUrl(config)

    if (pendingMap.has(pendingUrl)) {
      const controller = pendingMap.get(pendingUrl)
      controller && controller.abort()
      pendingMap.delete(pendingUrl)
    }
  }

  reset() {
    pendingMap = new Map<string, AbortController>()
  }
}

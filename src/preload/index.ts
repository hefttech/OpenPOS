import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import type { NewItem, ProductQuery } from '../main/types'

// Custom APIs for renderer
const api = {
  product: {
    test: () => ipcRenderer.invoke('product:test'),
    all: (page: number, pageSize: number, query?: ProductQuery) =>
      ipcRenderer.invoke('product:all', page, pageSize, query),
    categories: () => ipcRenderer.invoke('product:categories'),
    stockSummary: () => ipcRenderer.invoke('product:stockSummary'),
    add: (item: NewItem) => ipcRenderer.invoke('product:add', item),
    adjustStock: (sku: string, delta: number) =>
      ipcRenderer.invoke('product:adjustStock', sku, delta)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

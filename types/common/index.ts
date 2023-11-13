export * from './query'
export * from './select'

export type BaseStyle = Record<string, any>
export type CommonError = any
export type ICoordinate = [number, number]
export interface IPaginationList<T> {
  results: T[]
  totalCount: number
}

declare global {
  interface IWindow {
    Atlas: any
    gtag: any
    amplitude: any
  }
}

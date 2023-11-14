/* eslint-disable max-lines */
import { Dispatch, SetStateAction } from 'react'
import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import { EAccountType } from 'enums/user'
import capitalize from 'lodash/capitalize'
import get from 'lodash/get'
import { NextRouter } from 'next/router'
import { ETokenKey, PLATFORM } from 'API/constants'
import { EDeviceType } from 'components/MultiCarousel/constants'
import { ICarouseItem } from 'interfaces/listing'
import { ICoordinate } from 'types'
dayjs.extend(isSameOrBefore)

export function thousandSeparator(number: number, locale: string = 'vi'): string {
  return Number(number).toLocaleString(locale)
}

export function thousandSeparatorByComma(number: number): string {
  return number ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
}

export function thousandSeparatorByCommaAndDotDecimal(value: string): string {
  const seperatedParts: string[] = value.split('.')
  const intPart: string = seperatedParts[0]
  const formattedIntPartWithComas: string = Number(intPart).toLocaleString()
  let finalValue: string = formattedIntPartWithComas
  const hasContainedDot: boolean = value.includes('.')
  if (hasContainedDot) {
    const decimalPart: string = seperatedParts[1] ? seperatedParts[1] : ''
    finalValue = formattedIntPartWithComas.concat('.', decimalPart)
  }
  return finalValue
}

export function thousandSeparatorByDot(number: number): string {
  return number ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''
}

// INFO: parse string seperator by comma to a number
export function parseCommaStringToNumber(commaString: string): number {
  return Number(commaString ? commaString.replace(/\D/g, '') : '0')
}

export function getPositiveNumberOnly(inputValue: string): string {
  let result = inputValue.replaceAll(/[^0-9]/g, '')
  result = Number(result) > 0 ? Number(result).toString() : ''
  return result
}

export function isValidArray(item: string | string[]): string[] | boolean {
  item = Array.isArray(item) ? item : ['']
  if (item.length !== 0 && item[0] !== '' && item) {
    return item
  }
  return false
}

export function filterValidArrayFromArray(array: (string | string[])[]): (string | string[])[] {
  array = array.filter(isValidArray)
  return array
}

export function checkValidArray<T>(array?: T[]): boolean {
  return array ? Array.isArray(array) && array.length > 0 : false
}

export function getValidArray<T>(array?: T[]): T[] {
  return checkValidArray<T>(array) ? array || [] : []
}

export function getCapitalizeArray(array?: string[]): string[] {
  return getValidArray(array).map(e => capitalize(e))
}
export function setState<T>(state: T, setThisState: Dispatch<SetStateAction<T>>) {
  setThisState(state)
}

export function getDayOfWeek(day: number): string {
  const dayOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  return dayOfWeek[day] ?? ''
}

export function getDayOfWeekSundayFirst(day: number): string {
  const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  return dayOfWeek[day] ?? ''
}

export function getValidEnding(
  amount: number,
  unit: string,
  rightText: string = '',
  isAllowZero?: boolean,
  isNoAmount?: boolean
): string {
  const nullString: string = isAllowZero ? `0 ${unit}` : ''
  const unitWithEnding: string = `${unit}${amount > 1 ? 's' : ''}`
  return `${
    amount < 1 && !isNoAmount ? nullString : `${isNoAmount ? '' : amount}${rightText ? '+' : ''} ${unitWithEnding}`
  }${rightText}`
}

export function getQueryValue(router: NextRouter, param: string = 'page', defaultValue: number = 0): number {
  return Number(get(router, `query.${param}`, defaultValue)) || defaultValue
}

export function getShortAddress(address: string): string {
  return getValidArray(address.split(',')).slice(0, 2).join(', ')
}

export function getCensorAddress(address: string, buildiumPropertyId: number): string {
  const addressSplit: string[] = getValidArray<string>(String(address).split(', '))
  if (addressSplit.length < 3) {
    return `#${buildiumPropertyId}`
  }
  const city: string = addressSplit[1]
  const state: string = addressSplit[2].split(' ')[0]
  return `#${buildiumPropertyId}, ${city}, ${state}`
}

export function getAuthenticateStorageKey(platform: PLATFORM): ETokenKey {
  switch (platform) {
    case PLATFORM.OWNER:
      return ETokenKey.OWNER_ACCESS_TOKEN
    case PLATFORM.CMS:
      return ETokenKey.CMS_ACCESS_TOKEN
    default:
      return ETokenKey.WEBSITE_ACCESS_TOKEN
  }
}

export function getAccountType(platform: PLATFORM): EAccountType {
  switch (platform) {
    case PLATFORM.OWNER:
      return EAccountType.OWNER
    case PLATFORM.CMS:
      return EAccountType.STAFF
    default:
      return EAccountType.CUSTOMER
  }
}

export function checkValidCoordinates(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180 && !isNaN(lat) && !isNaN(lng)
}

export function roundNumberToFixedDigits(number: string | number, digits = 2): string {
  return Number.parseFloat(`${number}`).toFixed(digits)
}

//*INFO: export function get center of coordinates array of object with lat and lng
export function getCenterOfCoordinates(coordinates: ICoordinate[]): [number, number] {
  const validCoordinates: ICoordinate[] = getValidArray<ICoordinate>(
    coordinates.filter(coordinate => checkValidCoordinates(coordinate[0], coordinate[1]))
  )
  const totalLat: number = validCoordinates.reduce((total, coordinate) => total + Number(coordinate[0]), 0)
  const totalLng: number = validCoordinates.reduce((total, coordinate) => total + Number(coordinate[1]), 0)
  const [lat, lng] = [Number(totalLat / validCoordinates.length), Number(totalLng / validCoordinates.length)]
  return [lat, lng]
}

export function getDirtyValues(dirtyFields: object | boolean, allValues: object): object {
  // If *any* item in an array was modified, the entire array must be submitted, because there's no way to indicate
  // "placeholders" for unchanged elements. `dirtyFields` is true for leaves.
  if (dirtyFields === true || Array.isArray(dirtyFields)) return allValues
  // Here, we have an object
  return Object.fromEntries(
    Object.keys(dirtyFields).map(key => {
      //@ts-ignore
      return [key, getDirtyValues(dirtyFields[key], allValues[key])]
    })
  )
}

export function getDefaultSlide(defaultSlide: ICarouseItem[], defaultImageUrl: string): ICarouseItem[] {
  const newDefaultSlide: ICarouseItem[] = defaultSlide
  newDefaultSlide[0].url = defaultImageUrl ? defaultImageUrl : defaultSlide[0].url
  return newDefaultSlide
}

export function isNullEmptyBlank(text: string): boolean {
  return text === null || text.match(/^ *$/) !== null
}

export function extractFromFullName(fullName: string | undefined): {
  firstName: string
  lastName: string
} {
  if (!fullName) {
    return { firstName: '', lastName: '' }
  }

  const nameChunks: string[] = fullName?.split(' ')
  const firstName: string = nameChunks?.splice(0, 1)?.join('')
  const lastName: string = nameChunks?.join(' ') || firstName

  return { firstName: firstName, lastName: lastName }
}

export function hasChanges<T>(previousFormValues: Partial<T>, formValues: Partial<T>): boolean {
  if (!previousFormValues) {
    return true
  }

  return Object.keys(formValues).some(key => {
    if (get(previousFormValues, key) !== get(formValues, key)) {
      return true
    }
    return false
  })
}

export function getRawUSPhoneNumber(phoneNumber: string): string {
  if (!phoneNumber) {
    return ''
  }
  const rawPhoneNumber: string = phoneNumber.replace(/[^0-9\+]/g, '')
  const US_AREA_CODE: string = '+1'
  return rawPhoneNumber.startsWith(US_AREA_CODE) ? rawPhoneNumber : `${US_AREA_CODE}${rawPhoneNumber}`
}

export function formatUSPhoneNumber(phoneNumber: string): string {
  const cleaned: string = ('' + phoneNumber).replace(/\D/g, '')
  const match: RegExpMatchArray | null = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return ['(', match[2], ') ', match[3], '-', match[4]].join('')
  }
  return ''
}

export function getDeviceType(isMobile?: boolean, isTablet?: boolean): EDeviceType {
  if (isMobile) {
    return EDeviceType.MOBILE
  }

  if (isTablet) {
    return EDeviceType.TABLET
  }

  return EDeviceType.DESKTOP
}

export function getFullName(firstName?: string, lastName?: string, middleName?: string): string {
  let nameArray: (string | undefined)[] = [firstName, middleName, lastName]
  nameArray = nameArray.filter(Boolean)

  return nameArray.join(' ')
}

export function convertQueryParamToBoolean(queryValue?: string): boolean {
  return (queryValue ?? '').toLowerCase() === 'true'
}

export function convertNumberToUSD(value: number): string {
  const formatter: Intl.NumberFormat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  })

  return formatter.format(value)
}

export function convertUSDToCent(value: number): number {
  // INFO: 1 USD = 100 cent
  return value * 100
}

export function prependHTTPSToUrl(url: string): string {
  if (!url.match(/^[a-zA-Z]+:\/\//) && url) {
    return `https://${url}`
  }

  return url
}

export function formatAvailableDate(availableDate: Date): string {
  const isBeforeOrSameNowDate: boolean = dayjs(availableDate).isSameOrBefore(dayjs())

  if (isBeforeOrSameNowDate) {
    return 'Now'
  }

  return dayjs(availableDate).format('MMM Do')
}

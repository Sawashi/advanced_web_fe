import {
  checkValidCoordinates,
  extractFromFullName,
  formatUSPhoneNumber,
  getCensorAddress,
  getCenterOfCoordinates,
  getRawUSPhoneNumber
} from './common'

describe('utils', () => {
  it('checkValidCoordinates: Should return correct value', () => {
    expect(checkValidCoordinates(9.9824245, 76.5703886)).toEqual(true)
    expect(checkValidCoordinates(9.2323, NaN)).toEqual(false)
    expect(checkValidCoordinates(-100, 76.5703886)).toEqual(false)
  })
  it('getCenterOfCoordinates: Should return correct value', () => {
    expect(
      getCenterOfCoordinates([
        [9.9824245, 76.5703886],
        [9.9824245, 76.5703886]
      ])
    ).toEqual([9.9824245, 76.5703886])
  })
  it('getCensorAddress: Should return correct value', () => {
    expect(getCensorAddress('4809 South Kendall Drive, Independence, MO 9999, UnitedStates', 999)).toEqual(
      '#999, Independence, MO'
    )
    expect(getCensorAddress('4809 South Kendall Drive, Independence, MO, UnitedStates', 999)).toEqual(
      '#999, Independence, MO'
    )
  })
})

describe('common.ts: extractFromFullName()', () => {
  it('Should return correct name with empty full name', () => {
    const { firstName, lastName } = extractFromFullName(undefined)
    expect(firstName).toEqual('')
    expect(lastName).toEqual('')
  })

  it('Should return correct name with 1 characters', () => {
    const { firstName, lastName } = extractFromFullName('Alexander')
    expect(firstName).toEqual('Alexander')
    expect(lastName).toEqual('Alexander')
  })

  it('Should return correct name with 2 characters', () => {
    const { firstName, lastName } = extractFromFullName('Alexander Graham')
    expect(firstName).toEqual('Alexander')
    expect(lastName).toEqual('Graham')
  })

  it('Should return correct name with 3 characters', () => {
    const { firstName, lastName } = extractFromFullName('Alexander Graham Bell')
    expect(firstName).toEqual('Alexander')
    expect(lastName).toEqual('Graham Bell')
  })

  it('Should return correct name with 4 characters', () => {
    const { firstName, lastName } = extractFromFullName('Alexander Graham Bell St')
    expect(firstName).toEqual('Alexander')
    expect(lastName).toEqual('Graham Bell St')
  })
})

describe('common.ts: getRawUSPhoneNumber()', () => {
  it('Should return correct raw US phone number', () => {
    const mockPhoneNumber: string = '+1 (123) 456-7890'
    const phoneNumber: string = getRawUSPhoneNumber(mockPhoneNumber)
    const expectPhoneNumber: string = '+11234567890'

    expect(phoneNumber).toEqual(expectPhoneNumber)
  })

  it('Should return correct raw US phone number when don"t have white space', () => {
    const mockPhoneNumber: string = '+1 (123)456-7890'
    const phoneNumber: string = getRawUSPhoneNumber(mockPhoneNumber)
    const expectPhoneNumber: string = '+11234567890'

    expect(phoneNumber).toEqual(expectPhoneNumber)
  })

  it('Should return empty string when pass empty string', () => {
    const mockPhoneNumber: string = ''
    const phoneNumber: string = getRawUSPhoneNumber(mockPhoneNumber)
    const expectPhoneNumber: string = ''

    expect(phoneNumber).toEqual(expectPhoneNumber)
  })
})

describe('common.ts: formatUSPhoneNumber()', () => {
  it('Should return correct US phone number format', () => {
    const mockPhoneNumber: string = '+11234567890'
    const phoneNumber: string = formatUSPhoneNumber(mockPhoneNumber)
    const expectPhoneNumber: string = '(123) 456-7890'

    expect(phoneNumber).toEqual(expectPhoneNumber)
  })

  it(`Should return correct US phone number format when don't have area code`, () => {
    const mockPhoneNumber: string = '1234567890'
    const phoneNumber: string = formatUSPhoneNumber(mockPhoneNumber)
    const expectPhoneNumber: string = '(123) 456-7890'

    expect(phoneNumber).toEqual(expectPhoneNumber)
  })

  it('Should return empty string when pass empty string', () => {
    const mockPhoneNumber: string = ''
    const phoneNumber: string = formatUSPhoneNumber(mockPhoneNumber)
    const expectPhoneNumber: string = ''

    expect(phoneNumber).toEqual(expectPhoneNumber)
  })
})

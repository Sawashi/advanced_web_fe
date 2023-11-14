import { render } from '@testing-library/react'
import Header from './index'

describe('index.tsx: Header()', () => {
  it('Should render Header page correctly', async () => {
    const utils = render(<Header />)
    const headerContent = await utils.findByText('This is header')
    expect(headerContent.textContent).toEqual('This is header')
  })
})

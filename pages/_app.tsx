import { ChakraProvider } from '@chakra-ui/react'
import { Provider } from 'mobx-react'
import type { AppProps } from 'next/app'
import { getTheme } from 'theme'
import { rootStore } from '../stores'
import '@fontsource/poppins'

export const theme = getTheme()
const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider {...rootStore}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  )
}

export default App

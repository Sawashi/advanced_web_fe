import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "mobx-react";
import type { AppProps } from "next/app";
import { getTheme } from "theme";
import { rootStore } from "../stores";
import { QueryClient, QueryClientProvider } from "react-query";
import "@fontsource/poppins";

const queryClient = new QueryClient();
export const theme = getTheme();

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider {...rootStore}>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </Provider>
    </QueryClientProvider>
  );
};

export default App;

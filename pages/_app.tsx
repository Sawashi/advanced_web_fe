import { ChakraProvider } from "@chakra-ui/react";
import "@fontsource/poppins";
import { Provider } from "mobx-react";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { getTheme } from "theme";
import { rootStore } from "../stores";

const queryClient = new QueryClient();
export const theme = getTheme();

const App = ({ Component, pageProps }: AppProps) => {
  rootStore.setQueryClient(queryClient);

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

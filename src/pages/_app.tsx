import { WagmiProvider, http } from 'wagmi';
import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { theme } from '@/layouts/theme';
import Layout from '@/layouts/Layout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { defaultChain } from '@/utils/contract';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';

const config = getDefaultConfig({
  appName: 'cit-web3-class',
  projectId: '1b5b1d5c351c838062b62002e37bee3c',
  chains: [defaultChain],
  transports: {
    [defaultChain.id]: http(),
  },
  ssr: true,
});

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <RainbowKitProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </RainbowKitProvider>
        </ChakraProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;

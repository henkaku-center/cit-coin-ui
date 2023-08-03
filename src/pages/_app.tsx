import { WagmiConfig, createClient, configureChains } from 'wagmi';
import { ChakraProvider, useColorMode } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { theme } from '@/layouts/theme';
import Layout from '@/layouts/Layout';
import { publicProvider } from '@wagmi/core/providers/public';
import { alchemyProvider } from '@wagmi/core/providers/alchemy';
import { defaultChain } from '@/utils/contract';
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
  lightTheme,
  darkTheme,
} from '@rainbow-me/rainbowkit';

const { chains, provider } = configureChains(
  [defaultChain],
  [
    process.env.NEXT_PUBLIC_NODE_ENV === 'production'
      ? publicProvider()
      : alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || '' }),
  ],
);

const { connectors } = getDefaultWallets({
  appName: process.env['NEXT_PUBLIC_WALLET_CONNECT_PROJECT_NAME '] || '',
  projectId: process.env['NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID '] || '',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors: connectors,
  provider,
});

const RainbowWrapper = (props: { children: any }) => {
  const { colorMode } = useColorMode();

  return (
    <RainbowKitProvider
      chains={chains}
      modalSize={'wide'}
      theme={colorMode == 'dark' ? darkTheme() : lightTheme()}
    >
      {props.children}
    </RainbowKitProvider>
  );
};

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <WagmiConfig client={wagmiClient}>
      <ChakraProvider theme={theme}>
        <RainbowWrapper>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </RainbowWrapper>
      </ChakraProvider>
    </WagmiConfig>
  );
}

export default MyApp;

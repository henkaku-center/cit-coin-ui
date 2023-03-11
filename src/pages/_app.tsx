import { WagmiConfig, createClient, configureChains } from 'wagmi'
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { theme } from '@/layouts/theme'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import Layout from '@/layouts/Layout'
import { publicProvider } from '@wagmi/core/providers/public'
// import connector from '@/components/metaMask/WagmiMetamask'
import { avalancheFuji } from 'wagmi/chains'

const { chains, provider } = configureChains(
  [avalancheFuji],
  [publicProvider()],
)

const client = createClient({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  provider,
})

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <WagmiConfig client={client}>
      <ChakraProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </WagmiConfig>
  )
}

export default MyApp

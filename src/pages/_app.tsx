import {WagmiConfig, createClient, configureChains, useConnect} from 'wagmi'
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { theme } from '@/layouts/theme'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import Layout from '@/layouts/Layout'
import { publicProvider } from '@wagmi/core/providers/public'
import { defaultChain } from '@/utils/contract';
import {SafeConnector} from "@wagmi/connectors/safe";
import {FC, useEffect} from "react";
import {NextComponentType, NextPageContext} from "next";

const { chains, provider } = configureChains(
  [defaultChain],
  [publicProvider()],
)

const client = createClient({
  autoConnect: false,
  connectors: [new MetaMaskConnector({ chains }), new SafeConnector({chains,  options: {
      allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/],
      debug: true,
    }})],
  provider,
})

const AUTOCONNECTED_CONNECTOR_IDS = ['safe'];

function MyApp({ Component, pageProps }: AppProps): JSX.Element {

  return (
    <WagmiConfig client={client}>
        <Inner Component={Component} pageProps={pageProps}/>
    </WagmiConfig>
  )
}

const Inner:FC<{
    Component: NextComponentType<NextPageContext, any, {}>
    pageProps: any
}> = ({ Component, pageProps })=>{
    const { connect, connectors } = useConnect();

    useEffect(() => {
        AUTOCONNECTED_CONNECTOR_IDS.forEach((connector) => {
            const connectorInstance = connectors.find((c) => c.id === connector && c.ready);

            if (connectorInstance) {
                connect({ connector: connectorInstance });
            }
        });
    }, [connect, connectors]);

    return(
        <ChakraProvider theme={theme}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </ChakraProvider>
    )
}

export default MyApp

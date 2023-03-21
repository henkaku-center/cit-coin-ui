import { useAccount, useConnect, useDisconnect, useNetwork } from 'wagmi';
import {
  Card,
  Button,
  CardHeader,
  CardBody,
  Stack,
  Divider,
  Heading,
  Link,
} from '@chakra-ui/react';
import useTranslation from 'next-translate/useTranslation';
import { ArrowForwardIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { defaultChain } from '@/utils/contract';

export const MetaMaskConnectCard = () => {
  const { t } = useTranslation('common');
  const { chain } = useNetwork();
  // const connector = new MetaMaskConnector({
  //   chains: [avalancheFuji, avalanche],
  //   options: {
  //     shimDisconnect: true,
  //     shimChainChangedDisconnect: true
  //     // UNSTABLE_shimOnConnectSelectAccount: true
  //   }
  // })
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { isSuccess, isIdle, connectors } = useConnect();
  const [MetaMask] = connectors;
  const metaMaskConnectButton = (
    <>
      {/*{connectors.map((connector) => (*/}
      <Button
        width="250px"
        colorScheme="orange"
        loadingText="Connecting..."
        onClick={() => {
          MetaMask.connect().catch((err) => {
            console.log(err);
          });
        }}
      >
        {t('walletCard.button.connectWallet')}
      </Button>
      {/*))}*/}
    </>
  );
  const SwitchNetwork = (
    <Stack direction={['column']} my={3}>
      {MetaMask.chains.map((_chain) => (
        <Button
          key={_chain.id}
          variant="outline"
          colorScheme="orange"
          rightIcon={<ArrowForwardIcon />}
          onClick={() => {
            MetaMask?.switchChain?.(_chain.id).catch((err) => {
              console.log(err);
            });
          }}
        >
          Switch the Network to {_chain.name}
        </Button>
      ))}
    </Stack>
  );

  return (
    <Card>
      <CardHeader>
        <Heading as="h2">
          {!isConnected && t('wallet.CONNECT')}
          {isConnected && chain?.id != defaultChain.id && t('walletCard.title.switchNetwork')}
          {isConnected && chain?.id == defaultChain.id && t('walletCard.title.switchedNetwork')}
        </Heading>
        <Divider mt={10} />
      </CardHeader>
      <CardBody>
        {!isConnected && metaMaskConnectButton}
        {isConnected && chain?.id != defaultChain.id && SwitchNetwork}
        {isConnected && chain?.id == defaultChain.id && (
          <>
            <Link as={NextLink} href="/quests">
              <Button width={250}>
                Go to Quests <ExternalLinkIcon mx="2px" />
              </Button>
            </Link>
          </>
        )}
        {isConnected && (
          <Button colorScheme="red" onClick={() => disconnect()}>
            {t('wallet.DISCONNECT')}
          </Button>
        )}
      </CardBody>
    </Card>
  );
};

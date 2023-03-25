import { useAccount, useConnect, useDisconnect, useNetwork } from 'wagmi';
import {
  Button,
  Box,
  Stack,
  CardFooter,
  Spacer,
  Spinner,
  useToast,
  Badge,
} from '@chakra-ui/react';

import { ArrowForwardIcon } from '@chakra-ui/icons';
import useTranslation from 'next-translate/useTranslation';
import { defaultChain } from '@/utils/contract';

export const ConnectionProfile = () => {
  const { t } = useTranslation('common');
  const { address, connector, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const toast = useToast();

  if (isConnected && chain?.id == defaultChain.id) {
    return (
      <>
        <Stack>
          <Box>
            <Badge fontSize={'large'} ml={2} p={1} px={3} borderRadius={'full'} colorScheme={'green'}>
              {address}
            </Badge>
          </Box>
          <Box>{t('wallet.CONNECTED')}</Box>
          <Spacer />
          <Button minWidth={250} colorScheme='red' onClick={() => disconnect()}>
            {t('wallet.DISCONNECT')}
          </Button>
        </Stack>
      </>
    );
  }
  if (isConnected) {
    return (
      <>
        <Stack direction={['column']} my={3}>
          {connector?.chains.filter(_chain => _chain.id !== chain?.id).map((_chain) => (
            <Button
              key={_chain.id}
              variant='outline'
              colorScheme='orange'
              rightIcon={<ArrowForwardIcon />}
              onClick={() => {
                connector
                  ?.switchChain?.(_chain.id)
                  .then((_chain) => {
                    toast({
                      title: 'Metamask connection Successful',
                      status: 'success',
                      duration: 5000,
                      isClosable: true,
                      position: 'top',
                    });
                  })
                  .catch((err) => {
                    toast({
                      title: 'Metamask connection failure',
                      description: err.message,
                      status: 'error',
                      duration: 5000,
                      isClosable: true,
                      position: 'top',
                    });
                  });
              }}
            >
              {t('wallet.SWITCH_NETWORK')} - {_chain.name}
            </Button>
          ))}
          <Button minWidth={250} colorScheme='red' onClick={() => disconnect()}>
            {t('wallet.DISCONNECT')}
          </Button>
        </Stack>
      </>
    );
  }

  return (
    <>
      <Stack>
        {connectors.map((connector) => (
          <Button
            disabled={!connector.ready}
            key={connector.id}
            onClick={() => connect({ connector })}
          >
            {!isLoading &&
              `${t('wallet.CONNECT')} - ${connector.name} ${!connector.ready ? ' (unsupported)' : ''}`}
            {isLoading && connector.id === pendingConnector?.id && <Spinner />}
          </Button>
        ))}
      </Stack>
      {error && <CardFooter>{error.message}</CardFooter>}
    </>
  );
};

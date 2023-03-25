import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader, Code,
  Grid,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  useToast,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { useAccount, useBalance, useNetwork } from 'wagmi';
import { defaultChain, getContractAddress } from '@/utils/contract';

export const ContractDetail = () => {
  const { t } = useTranslation('common');
  const { address, connector, isConnected } = useAccount();

  const { chain } = useNetwork();

  const citCoin = getContractAddress('CitCoin');
  const toast = useToast();
  const { data } = useBalance({
    address: address,
    token: citCoin,
    watch: true,
    onError: () => {
      toast({
        title: t('wallet.COULD_NOT_GET_BALANCE'),
        position: 'top',
        status: 'error',
      });
    },
  });
  return (
    <Card variant={'filled'}>
      <CardHeader>
        <Text fontSize={'xl'} fontWeight={'bold'}>
          {isConnected && t('wallet.ACCOUNT_DETAIL')}
          {!isConnected && t('wallet.CONNECT_TO_CONTINUE')}
        </Text>
      </CardHeader>
      {isConnected && chain?.id == defaultChain.id && (
        <CardBody>
          <Stack>
            <Stat p={2} borderRadius={'1em'} border={'solid 2px'}>
              <StatLabel>{t('wallet.BALANCE')}</StatLabel>
              <StatNumber>
                <Text as={'span'} color={'orange'}>
                  {data?.formatted}
                </Text>{' '}
                {data?.symbol}
              </StatNumber>
              <StatHelpText>as of {new Date().toLocaleString()}</StatHelpText>
            </Stat>
            <Grid py={5} templateColumns={'200px 1fr'} gap={2} fontWeight={'bold'}>
              <Text>{t('wallet.CONTRACT_ADDRESS')}</Text>
              <Code px={3} py={1} variant={'outline'} fontSize={'lg'} borderRadius={'lg'}>{citCoin}</Code>
              <Text>{t('wallet.ADDRESS')}</Text>
              <Code px={3} py={1} variant={'outline'} fontSize={'lg'} borderRadius={'lg'}>{address}</Code>
            </Grid>
            {/*<Button colorScheme={'orange'} width={'100%'} as={NextLink} href={'/mint'}>*/}
            {/*  Mint your Tokens*/}
            {/*</Button>*/}
          </Stack>
        </CardBody>
      )}
    </Card>
  );
};
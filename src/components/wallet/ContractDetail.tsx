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

  const citCoinAddress = getContractAddress('CitCoin');
  const LearnToEarnAddress = getContractAddress('LearnToEarn');
  const toast = useToast();
  const { data: citCoin } = useBalance({
    address: address,
    token: citCoinAddress,
    watch: true,
    onError: () => {
      toast({
        title: t('wallet.COULD_NOT_GET_BALANCE'),
        position: 'top',
        status: 'error',
      });
    },
  });
  const { data: matic } = useBalance({
    address: address,
    // token: citCoinAddress,
    watch: true,
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
            {[matic, citCoin].map((item, index) => (
              <Stat key={index} p={2} borderRadius={'1em'} border={'solid 2px'} mb={4}>
                <StatLabel>{t('wallet.BALANCE')} - {item?.symbol}</StatLabel>
                <StatNumber>
                  <Text as={'span'} color={'orange'} mr={2}>
                    {item?.formatted}
                  </Text>
                  {item?.symbol}
                </StatNumber>
                <StatHelpText>as of {new Date().toLocaleString()}</StatHelpText>
              </Stat>
            ))}

            <Grid py={5} templateColumns={'200px 1fr'} gap={2} fontWeight={'bold'}>
              <Text>cJPY</Text>
              <Code px={3} py={1} variant={'outline'} colorScheme={'red'} fontSize={'lg'} borderRadius={'lg'}>
                {citCoinAddress}
              </Code>
              <Text>{t('wallet.CONTRACT_ADDRESS')}</Text>
              <Code px={3} py={1} variant={'outline'} colorScheme={'green'} fontSize={'lg'} borderRadius={'lg'}>
                {LearnToEarnAddress}
              </Code>
              <Text>{t('wallet.ADDRESS')}</Text>
              <Code px={3} py={1} variant={'outline'} colorScheme={'blue'} fontSize={'lg'} borderRadius={'lg'}>
                {address}
              </Code>
            </Grid>
          </Stack>
        </CardBody>
      )}
    </Card>
  );
};
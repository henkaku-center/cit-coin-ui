import {
  Card,
  CardBody,
  CardHeader, Code, Flex, Link,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  useToast,
} from '@chakra-ui/react';
import useTranslation from 'next-translate/useTranslation';
import { useAccount, useBalance, useNetwork } from 'wagmi';
import { defaultChain, getContractAddress } from '@/utils/contract';

export const ContractDetail = () => {
  const { t } = useTranslation('common');
  const { address, connector, isConnected } = useAccount();

  const { chain } = useNetwork();

  const citCoinAddress = getContractAddress('CitCoin');
  const LearnToEarnAddress = getContractAddress('LearnToEarn');
  const NFTAddress = getContractAddress('NFT');
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
    <Card variant={'filled'} width={'full'}>
      <CardHeader>
        <Text fontSize={'xl'} fontWeight={'bold'}>
          {isConnected && t('wallet.ACCOUNT_DETAIL')}
          {!isConnected && t('wallet.CONNECT_TO_CONTINUE')}
        </Text>
      </CardHeader>
      {isConnected && chain?.id == defaultChain.id && (
        <CardBody>
          <Stack>
            <Stat p={2} borderRadius={'1em'} border={'solid 2px'} mb={4}>
              <StatLabel>{t('wallet.BALANCE')} - {citCoin?.symbol}</StatLabel>
              <StatNumber fontSize={'lg'}>
                <Text as={'span'} color={'orange'} mr={2}>
                  {citCoin?.formatted}
                </Text>
                {citCoin?.symbol}
              </StatNumber>
              <StatHelpText>as of {new Date().toLocaleString()}</StatHelpText>
            </Stat>
            <Stack spacing={3} py={5}>
              {[
                { label: 'cJPY', value: citCoinAddress, color: 'red' },
                { label: t('wallet.CONTRACT_ADDRESS'), value: LearnToEarnAddress, color: 'green' },
                { label: t('wallet.ADDRESS'), value: address, color: 'blue' },
                { label: 'NFT', value: NFTAddress, color: 'blue' },
              ].map(({ label, value, color }, index) => (
                <Flex flexWrap={'wrap'} key={index}>
                  <Text fontSize={'sm'} minW={'180px'}>{label}</Text>
                  <Code
                    as={Link} px={3} py={1} variant={'outline'} colorScheme={color} borderRadius={'lg'}
                    href={`https://${process.env.NODE_ENV??'dev' === 'dev' ? 'mumbai.' : ''}polygonscan.com/address/${value}`}
                    target={'_blank'}
                  >
                    {value}
                  </Code>
                </Flex>
              ))}
            </Stack>
          </Stack>
        </CardBody>
      )}
    </Card>
  );
};
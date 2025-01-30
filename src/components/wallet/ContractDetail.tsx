import {
  Card,
  CardBody,
  CardHeader,
  Code,
  Flex,
  Link,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from '@chakra-ui/react';
import useTranslation from 'next-translate/useTranslation';
import { useAccount } from 'wagmi';
import { defaultChain, getContractAddress } from '@/utils/contract';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { CryptoLink } from '../CryptoLink';

export const ContractDetail = () => {
  const { t } = useTranslation('common');
  const { address, isConnected, chain } = useAccount();

  const cJPYAddress = getContractAddress('cJPY');
  const LearnToEarnAddress = getContractAddress('LearnToEarn');
  const NFTAddress = getContractAddress('NFT');
  const cJPYBalance = useTokenBalance({ address, tokenAddress: cJPYAddress, watch: true });
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
              <StatLabel>
                {t('wallet.BALANCE')} - {cJPYBalance?.symbol}
              </StatLabel>
              <StatNumber fontSize={'lg'}>
                <Text as={'span'} color={'orange'} mr={2}>
                  {cJPYBalance?.formatted}
                </Text>
                {cJPYBalance?.symbol}
              </StatNumber>
              <StatHelpText>as of {new Date().toLocaleString()}</StatHelpText>
            </Stat>
            <Stack spacing={3} py={5}>
              {[
                { label: 'cJPY', value: cJPYAddress, color: 'red' },
                { label: t('wallet.CONTRACT_ADDRESS'), value: LearnToEarnAddress, color: 'green' },
                { label: t('wallet.ADDRESS'), value: address, color: 'blue' },
                { label: 'NFT', value: NFTAddress, color: 'blue' },
              ].map(({ label, value, color }, index) => (
                <Flex flexWrap={'wrap'} key={index}>
                  <Text fontSize={'sm'} minW={'180px'}>
                    {label}
                  </Text>
                  <CryptoLink type="address" value={value as `0x${string}`} colorScheme={color}>
                    {value}
                  </CryptoLink>
                </Flex>
              ))}
            </Stack>
          </Stack>
        </CardBody>
      )}
    </Card>
  );
};

import useTranslation from 'next-translate/useTranslation';
import { Container, Heading, Stack } from '@chakra-ui/react';
import FaucetABI from "@/utils/abis/Faucet.json";
import { BigNumber } from 'ethers';

export const FaucetSettings = () => {
  const { t } = useTranslation('admin');

  return (<Container maxW={'container.lg'}>
    <Heading mb={5}>{t('faucet.HEADING')}</Heading>
    <Stack spacing={10}>
    </Stack>
  </Container>);
};
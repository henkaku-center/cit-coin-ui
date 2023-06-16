import { useAccount, useBalance, useNetwork } from 'wagmi';

import { UseContractConfig } from '@/hooks/useContractConfig';
import { useToast } from '@chakra-ui/react';
import useTranslation from 'next-translate/useTranslation';
import { getContractAddress } from '@/utils/contract';

interface useTokenBalanceData {
  address?: `0x${string}`;
  tokenAddress?: `0x${string}`;
  watch?: boolean;
}

export const useTokenBalance = (data: useTokenBalanceData) => {
  const toast = useToast();
  const { t } = useTranslation('default');

  const { data: balanceData } = useBalance({
    address: data.address,
    token: data.tokenAddress,
    watch: data.watch ?? false,
    onError: () => {
      toast({
        title: t('wallet.COULD_NOT_GET_BALANCE'),
        position: 'top',
        status: 'error',
      });
    },
  });
  return balanceData;
};
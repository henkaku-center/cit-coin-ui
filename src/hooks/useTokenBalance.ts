import { useBalance } from 'wagmi';

import { useToast } from '@chakra-ui/react';
import useTranslation from 'next-translate/useTranslation';
import { useEffect } from 'react';

interface useTokenBalanceData {
  address?: `0x${string}`;
  tokenAddress?: `0x${string}`;
  watch?: boolean;
}

export const useTokenBalance = (data: useTokenBalanceData) => {
  const toast = useToast();
  const { t } = useTranslation('default');

  const { data: balanceData, status } = useBalance({
    address: data.address,
    token: data.tokenAddress,
  });

  useEffect(() => {
    if (status == 'error') {
      toast({
        title: t('wallet.COULD_NOT_GET_BALANCE'),
        position: 'top',
        status: 'error',
      });
    }
  }, [status, t, toast]);

  return balanceData;
};

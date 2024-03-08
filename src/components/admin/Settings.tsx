import {
  FormControl,
  FormLabel,
  Heading,
  Stack,
  FormHelperText,
  Button,
  Container,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
} from '@chakra-ui/react';
import useTranslation from 'next-translate/useTranslation';
import {
  useWriteContract,
  useReadContract,
  useSimulateContract,
  useAccount,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { useEffect, useState } from 'react';
import LearnToEarnABI from '@/utils/abis/LearnToEarn.json';
import { getContractAddress } from '@/utils/contract';
import { formatUnits, isAddress, parseUnits } from 'ethers/lib/utils';
import { BigNumber } from 'ethers';

const RewardPointSetting = () => {
  const { t } = useTranslation('admin');
  const [reward, setReward] = useState('0');
  const { chain } = useAccount();
  const LearnToEarnAddress = getContractAddress('LearnToEarn');
  const { data: currentRewardPoint, isLoading: currentRewardPointLoading } = useReadContract({
    address: LearnToEarnAddress,
    abi: LearnToEarnABI,
    functionName: 'rewardPoint',
    chainId: chain?.id,
  });

  useEffect(() => {
    let reward_decimals = formatUnits(BigNumber.from(currentRewardPoint ?? '0'), 18);
    setReward(reward_decimals.toString());
    // setReward((currentRewardPoint as string).slice(-18));
  }, [currentRewardPoint, currentRewardPointLoading]);

  const config = {
    address: LearnToEarnAddress,
    functionName: 'setRewardPoint',
    args: [parseUnits(reward || '0', 18)],
    abi: LearnToEarnABI,
  };

  const { error: configError } = useSimulateContract(config);
  const { data: hash, writeContract, isPending: contractWritePending } = useWriteContract();
  const { isSuccess, isPending, error } = useWaitForTransactionReceipt({ hash });
  const toast = useToast();
  useEffect(() => {
    if (!isPending) {
      if (isSuccess && !isPending) {
        toast({
          position: 'top',
          status: 'success',
          title: 'Success',
          description: 'Reward Points Successfully set',
        });
      } else {
        toast({
          position: 'top',
          status: 'error',
          title: 'Error',
          description: error.message,
        });
      }
    }
  }, [isSuccess, isPending, error?.message, toast]);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        writeContract?.(config);
      }}
    >
      <FormControl>
        <FormLabel>{t('settings.SET_REWARD_POINTS_LABEL')} (1 - 10000 cJPY)</FormLabel>
        <NumberInput
          min={10}
          max={10000}
          step={10}
          value={parseInt(reward)}
          onChange={(valueAsString) => {
            setReward(valueAsString || '0');
          }}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <FormHelperText>{t('settings.HELP_EARNING')}</FormHelperText>
        {/*<FormHelperText> {`${ t('settings.CURRENT_VALUE')}: ${currentRewardPoint}`}</FormHelperText>*/}
        <FormHelperText textColor={'blue.500'}>{t('settings.ONLY_OWNER')}</FormHelperText>
      </FormControl>
      <Button
        type={'submit'}
        my={5}
        colorScheme={'blue'}
        isLoading={contractWritePending}
        isDisabled={!reward || reward == currentRewardPoint || !!configError}
      >
        {t('SUBMIT')}
      </Button>
    </form>
  );
};

const AdminSetting = (props: { action: 'add' | 'remove' }) => {
  const { action } = props;
  const toast = useToast();
  const { t } = useTranslation('admin');
  const [admin, setAdmin] = useState('');
  const LearnToEarnAddress = getContractAddress('LearnToEarn');
  const config = {
    address: LearnToEarnAddress,
    functionName: action == 'add' ? 'setAdmin' : 'removeAdmin',
    args: [admin],
    abi: LearnToEarnABI,
  };
  const { error: configError } = useSimulateContract(config);
  const { data: hash, writeContract, isPending: contractWriteLoading } = useWriteContract();
  const { isSuccess, isPending, error, isFetching } = useWaitForTransactionReceipt({ hash });
  useEffect(() => {
    if (!isPending) {
      if (isSuccess && !isPending) {
        toast({
          position: 'top',
          status: 'success',
          title: 'Success',
          description: `Admin Successfully ${action === 'add' ? 'Added' : 'Removed'}`,
        });
      } else {
        toast({
          position: 'top',
          status: 'error',
          title: 'Error',
          description: error.message,
        });
      }
    }
  }, [isSuccess, isPending, error?.message, toast, action]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        writeContract?.(config);
      }}
    >
      <FormControl>
        <FormLabel>
          {t(action === 'add' ? 'settings.ADD_ADMIN_LABEL' : 'settings.REMOVE_ADMIN_LABEL')}
        </FormLabel>
        <Input
          value={admin}
          onChange={(e) => {
            setAdmin(e.target.value);
          }}
          fontFamily={'mono'}
          placeholder={'0x0000000000000000000000000000000000000000'}
        />
        {/*<FormHelperText>{`${t('settings.CURRENT_VALUE')}: ${currentAdmin}`}</FormHelperText>*/}
        <FormHelperText textColor={'blue.500'}>{t('settings.ONLY_OWNER')}</FormHelperText>
      </FormControl>
      <Button
        type={'submit'}
        my={5}
        colorScheme={'blue'}
        isLoading={contractWriteLoading || isFetching}
        isDisabled={!!configError || !isAddress(admin)}
      >
        {t('SUBMIT')}
      </Button>
    </form>
  );
};

export const Settings = () => {
  const { t } = useTranslation('admin');

  return (
    <Container maxW={'container.lg'}>
      <Heading mb={5}>{t('settings.HEADING')}</Heading>
      <Stack spacing={10}>
        <RewardPointSetting />
        <hr />
        <AdminSetting action={'add'} />
        <hr />
        <AdminSetting action={'remove'} />
        <hr />
      </Stack>
    </Container>
  );
};

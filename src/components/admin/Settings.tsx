import {
  FormControl, FormLabel, Heading, NumberInput, Stack, NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper, FormHelperText, FormErrorMessage, HStack, Button, Flex, Container, Input,
} from '@chakra-ui/react';
import useTranslation from 'next-translate/useTranslation';
import { usePrepareContractWrite, useContractWrite, useContractRead, useNetwork } from 'wagmi';
import { useEffect, useState } from 'react';
import LearnToEarnABI from '@/utils/abis/LearnToEarn.json';
import { getContractAddress } from '@/utils/contract';

const RewardPointSetting = () => {
  const { t } = useTranslation('admin');
  const [reward, setReward] = useState(0);
  const { chain } = useNetwork();
  const LearnToEarnAddress = getContractAddress('LearnToEarn');
  const {
    data: currentRewardPoint,
    isLoading: currentRewardPointLoading,
  } = useContractRead({
    address: LearnToEarnAddress,
    abi: LearnToEarnABI,
    functionName: 'rewardPoint',
    chainId: chain?.id,
  });
  useEffect(() => {
    setReward(currentRewardPoint as number);
  }, [currentRewardPoint, currentRewardPointLoading]);
  const { config, error: configError } = usePrepareContractWrite({
    address: LearnToEarnAddress,
    functionName: 'setRewardPoint',
    args: [reward],
    abi: LearnToEarnABI,
    enabled: !!reward,
  });
  const {
    write: ContractWrite,
    isLoading: contractWriteLoading,
  } = useContractWrite(config);
  return (<form onSubmit={(e) => {
    e.preventDefault();
    ContractWrite?.();
  }}>
    <FormControl>
      <FormLabel>
        {`${t('settings.SET_REWARD_POINTS_LABEL')} (${t('settings.CURRENT_VALUE')}: ${currentRewardPoint})`}
      </FormLabel>
      <NumberInput value={reward} step={1000000} onChange={(_, valueAsNumber) => {
        setReward(valueAsNumber || 0);
      }}>
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <FormHelperText>{t('settings.HELP_MAX_LIMIT')}</FormHelperText>
      <FormHelperText>{t('settings.HELP_EARNING')}</FormHelperText>
      <FormHelperText textColor={'blue.500'}>{t('settings.ONLY_OWNER')}</FormHelperText>
    </FormControl>
    <Button
      type={'submit'} my={5} colorScheme={'blue'}
      isLoading={contractWriteLoading}
      isDisabled={!reward || reward == currentRewardPoint}
    >{t('SUBMIT')}</Button>
  </form>);
};

const AdminSetting = () => {
  const { t } = useTranslation('admin');
  const [admin, setAdmin] = useState<`0x${string}`>('0x');
  const { chain } = useNetwork();
  const LearnToEarnAddress = getContractAddress('LearnToEarn');
  const {
    data: currentAdmin,
    isLoading: currentRewardPointLoading,
  } = useContractRead({
    address: LearnToEarnAddress,
    abi: LearnToEarnABI,
    functionName: 'admin',
    chainId: chain?.id,
  });
  useEffect(() => {
    setAdmin(currentAdmin as `0x${string}`);
  }, [currentAdmin, currentRewardPointLoading]);
  const { config, error: configError } = usePrepareContractWrite({
    address: LearnToEarnAddress,
    functionName: 'setAdmin',
    args: [admin],
    abi: LearnToEarnABI,
    enabled: !!admin,
  });
  const {
    write: ContractWrite,
    isLoading: contractWriteLoading,
  } = useContractWrite(config);
  return (<form onSubmit={(e) => {
    e.preventDefault();
    ContractWrite?.();
  }}>
    <FormControl>
      <FormLabel>
        {t('settings.SET_ADMIN_LABEL')}
      </FormLabel>
      <Input value={admin} step={1000000} onChange={(e) => {
        setAdmin(e.target.value as `0x${string}`);
      }} fontFamily={'mono'}
      />
      <FormHelperText>{`${t('settings.CURRENT_VALUE')}: ${currentAdmin}`}</FormHelperText>
      <FormHelperText textColor={'blue.500'}>{t('settings.ONLY_OWNER')}</FormHelperText>
    </FormControl>
    <Button
      type={'submit'} my={5} colorScheme={'blue'}
      isLoading={contractWriteLoading}
      isDisabled={!admin || admin == currentAdmin || !!configError}
    >{t('SUBMIT')}</Button>
  </form>);
};

export const Settings = () => {
  const { t } = useTranslation('admin');

  return (<Container maxW={'container.lg'}>
      <Heading mb={5}>{t('settings.HEADING')}</Heading>
      <Stack spacing={10}>
        <RewardPointSetting />
        <hr/>
        <AdminSetting />
        <hr/>
      </Stack>
    </Container>
  );
};
import {
  FormControl, FormLabel, Heading, Stack, FormHelperText, Button, Container, Input, NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import useTranslation from 'next-translate/useTranslation';
import { usePrepareContractWrite, useContractWrite, useContractRead, useNetwork } from 'wagmi';
import { useEffect, useState } from 'react';
import LearnToEarnABI from '@/utils/abis/LearnToEarn.json';
import { getContractAddress } from '@/utils/contract';
import { isAddress, parseUnits } from 'ethers/lib/utils';
import { BigNumber } from 'ethers';

const RewardPointSetting = () => {
  const { t } = useTranslation('admin');
  const [reward, setReward] = useState('');
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
    // dividing the value of rewards by 18 to set the current value in CIT coins
    let reward_decimals = BigNumber.from(currentRewardPoint).div(parseUnits('1', 18))
    setReward(reward_decimals.toString());
    // setReward((currentRewardPoint as string).slice(-18));
  }, [currentRewardPoint, currentRewardPointLoading]);

  const { config, error: configError } = usePrepareContractWrite({
    address: LearnToEarnAddress,
    functionName: 'setRewardPoint',
    args: [parseUnits(reward || "0", 18)],
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
      <NumberInput min={10} max={1000} step={10}  value={reward} onChange={(valueAsString) => {
        setReward(valueAsString || "0");
      }}>
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      {/*<Input value={reward} onChange={(event) => {*/}
      {/*  setReward(event.target.value);*/}
      {/*}} />*/}
      <FormHelperText>{t('settings.HELP_EQUIVALENT')}</FormHelperText>
      <FormHelperText>{t('settings.HELP_EARNING')}</FormHelperText>
      <FormHelperText textColor={'blue.500'}>{t('settings.ONLY_OWNER')}</FormHelperText>
    </FormControl>
    <Button
      type={'submit'} my={5} colorScheme={'blue'}
      isLoading={contractWriteLoading}
      isDisabled={!reward || reward == currentRewardPoint || !!configError}
    >{t('SUBMIT')}</Button>
  </form>);
};

const AdminSetting = () => {
  const { t } = useTranslation('admin');
  const [admin, setAdmin] = useState<`0x${string}`>('0x');
  const { chain } = useNetwork();
  const LearnToEarnAddress = getContractAddress('LearnToEarn');
  // const {
  //   data: currentAdmin,
  //   isLoading: currentRewardPointLoading,
  // } = useContractRead({
  //   address: LearnToEarnAddress,
  //   abi: LearnToEarnABI,
  //   functionName: 'admin',
  //   chainId: chain?.id,
  // });
  // useEffect(() => {
  //   setAdmin(currentAdmin as `0x${string}`);
  // }, [currentAdmin, currentRewardPointLoading]);
  const { config, error: configError } = usePrepareContractWrite({
    address: LearnToEarnAddress,
    functionName: 'setAdmin',
    args: [admin],
    abi: LearnToEarnABI,
    enabled: isAddress(admin),
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
      <Input value={admin} onChange={(e) => {
        setAdmin(e.target.value as `0x${string}`);
      }} fontFamily={'mono'}
      />
      {/*<FormHelperText>{`${t('settings.CURRENT_VALUE')}: ${currentAdmin}`}</FormHelperText>*/}
      <FormHelperText textColor={'blue.500'}>{t('settings.ONLY_OWNER')}</FormHelperText>
    </FormControl>
    <Button
      type={'submit'} my={5} colorScheme={'blue'}
      isLoading={contractWriteLoading}
      isDisabled={(!!configError || !isAddress(admin))}
    >{t('SUBMIT')}</Button>
  </form>);
};

export const Settings = () => {
  const { t } = useTranslation('admin');

  return (<Container maxW={'container.lg'}>
      <Heading mb={5}>{t('settings.HEADING')}</Heading>
      <Stack spacing={10}>
        <RewardPointSetting />
        <hr />
        <AdminSetting />
        <hr />
      </Stack>
    </Container>
  );
};
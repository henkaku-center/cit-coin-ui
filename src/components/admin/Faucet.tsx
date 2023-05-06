import useTranslation from 'next-translate/useTranslation';
import {
  Box, Button,
  Container,
  FormControl, FormHelperText, FormLabel,
  Heading, NumberDecrementStepper, NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Text,
} from '@chakra-ui/react';
import FaucetABI from '@/utils/abis/Faucet.json';
import { BigNumber } from 'ethers';
import { useContractReads, useContractWrite, useNetwork, usePrepareContractWrite } from 'wagmi';
import { formatUnits, parseEther, parseUnits } from 'ethers/lib/utils';
import { useState } from 'react';
import LearnToEarnABI from '@/utils/abis/LearnToEarn.json';

const faucetAddress = process.env.NEXT_PUBLIC_FAUCET_ADDRESS as `0x${string}`;


// NEXT_PUBLIC_FAUCET_ADDRESS
export const FaucetSettings = () => {
  const { t } = useTranslation('admin');
  const { chain } = useNetwork();

  const baseContract = {
    address: faucetAddress,
    abi: FaucetABI,
    chainId: chain?.id,
  };


  const { data, isLoading } = useContractReads({
    contracts: [
      { ...baseContract, functionName: 'lockDuration' },
      { ...baseContract, functionName: 'locked' },
      { ...baseContract, functionName: 'offering' },
      // { ...baseContract, functionName: 'server' },
    ],
  });
  const [lockDuration, locked, offering] = data ?? [null, null, BigNumber.from(0)];
  // @ts-ignore
  const [newOffering, setNewOffering] = useState<BigNumber>(offering);

  const { config, error: configError } = usePrepareContractWrite({
    address: faucetAddress,
    functionName: 'setOffering',
    args: [newOffering],
    abi: FaucetABI,
    // enabled: !!newOffering || offering.toString() == newOffering.toString(),
  });

  const {write: setOffering, isLoading: isOfferingLoading} = useContractWrite(config)

  return (<Container maxW={'container.lg'}>
    <Heading mb={5}>{t('faucet.HEADING')}</Heading>
    <Text mb={5}>{data?.toString()}</Text>
    <Stack spacing={10}>

      {/*Section 1: set Offering*/}
      <FormControl>
        <Text fontWeight={'bold'} fontSize={'large'} mb={3}>Offering</Text>
        <FormLabel>Please enter new offering:</FormLabel>
        <NumberInput
          min={0.0001} max={10} precision={4} step={0.01}
          value={formatUnits(newOffering)}
          onChange={(valueAsString) => {
            setNewOffering(parseUnits(valueAsString, 18));
          }}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <FormHelperText>{newOffering.toString()}</FormHelperText>
        <FormHelperText>{`Current Value: ${formatUnits(offering)}`}</FormHelperText>
      </FormControl>
      <Button
        isDisabled={offering.toString() == newOffering.toString()}
        isLoading={isOfferingLoading}
        onClick={()=>setOffering?.()}
      >Submit</Button>

      {/*Section 2: Locking */}
      <FormControl>
        <Text fontWeight={'bold'} fontSize={'large'} mb={3}>Locking</Text>
        <FormLabel>Please enter new offering:</FormLabel>
        <FormHelperText>{`Locked: ${locked}`}</FormHelperText>
      </FormControl>
    </Stack>

  </Container>);
};
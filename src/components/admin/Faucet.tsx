import useTranslation from 'next-translate/useTranslation';
import {
  Button,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Text,
} from '@chakra-ui/react';
import FaucetABI from '@/utils/abis/Faucet.json';
import { BigNumber, BigNumberish } from 'ethers';
import { useAccount, useReadContracts, useWriteContract, useSimulateContract } from 'wagmi';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { useState } from 'react';

const faucetAddress = process.env.NEXT_PUBLIC_FAUCET_ADDRESS as `0x${string}`;

// NEXT_PUBLIC_FAUCET_ADDRESS
export const FaucetSettings = () => {
  const { t } = useTranslation('admin');
  const { chain } = useAccount();

  const baseContract = {
    address: faucetAddress,
    abi: FaucetABI,
    chainId: chain?.id,
  };

  const { data } = useReadContracts({
    contracts: [
      { ...baseContract, functionName: 'lockDuration' },
      { ...baseContract, functionName: 'locked' },
      { ...baseContract, functionName: 'offering' },
      // { ...baseContract, functionName: 'server' },
    ],
  });
  const [lockDuration, locked, offering] = data?.map((d) => d.result) ?? [
    null,
    null,
    BigNumber.from(0),
  ];
  // @ts-ignore
  const [newOffering, setNewOffering] = useState<BigNumberish>(offering);

  const setOfferingConfig = {
    address: faucetAddress,
    functionName: 'setOffering',
    args: [newOffering],
    abi: FaucetABI,
  };

  const { isError } = useSimulateContract(setOfferingConfig);

  const { writeContract: setOffering, isPending: isOfferingLoading } = useWriteContract();
  return (
    <Container maxW={'container.lg'}>
      <Heading mb={5}>{t('faucet.HEADING')}</Heading>
      <Stack spacing={10}>
        {/*Section 1: set Offering*/}
        <FormControl>
          <Text fontWeight={'bold'} fontSize={'large'} mb={3}>
            Offering
          </Text>
          <FormLabel>Please enter new offering:</FormLabel>
          <NumberInput
            min={0.0001}
            max={10}
            precision={4}
            step={0.01}
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
          <FormHelperText>{`Current Value: ${formatUnits(
            offering as BigNumberish,
          )}`}</FormHelperText>
        </FormControl>
        <Button
          isDisabled={(offering as BigNumberish).toString() == newOffering.toString() || isError}
          isLoading={isOfferingLoading}
          onClick={() => setOffering?.(setOfferingConfig)}
        >
          Submit
        </Button>

        {/*Section 2: Locking */}
        <FormControl>
          <Text fontWeight={'bold'} fontSize={'large'} mb={3}>
            Locking
          </Text>
          <FormLabel>Please enter new offering:</FormLabel>
          <FormHelperText>{`Locked: ${locked}`}</FormHelperText>
        </FormControl>
      </Stack>
    </Container>
  );
};

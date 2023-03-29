import {
  Button,
  Container,
  FormControl, FormHelperText, FormErrorMessage,
  FormLabel,
  Heading, Input, NumberDecrementStepper, NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
} from '@chakra-ui/react';
import useTranslation from 'next-translate/useTranslation';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import LearnToEarnABI from '@/utils/abis/LearnToEarn.json';
import { getContractAddress } from '@/utils/contract';
import { useEffect, useState } from 'react';

const AddSingleStudentForm = () => {
  const LearnToEarnAddress = getContractAddress('LearnToEarn');
  const { t } = useTranslation('admin');
  const [address, setAddress] = useState<`0x${string}`>('0x');
  const [isInvalid, setInvalid] = useState(false);

  const { config, error: configError } = usePrepareContractWrite({
    address: LearnToEarnAddress,
    functionName: 'setRewardPoint',
    args: [address],
    abi: LearnToEarnABI,
    enabled: address.length < 22,
  });
  const {
    write: ContractWrite,
    isLoading: contractWriteLoading,
  } = useContractWrite(config);

  useEffect(() => {
      if (address == '0x') {
        setInvalid(false);
      } else if (configError || address.length < 42) {
        setInvalid(true);
      } else {
        setInvalid(false);
      }
      // if (address.length < 22) {
      //   setInvalid(true);
      // } else {
      //   setInvalid(false);
      // }
    }, [configError, address],
  );

  // const isAddressValid = ()=> address.st

  return (<form onSubmit={(event) => {
    event.preventDefault();
  }}>
    <FormControl isInvalid={isInvalid}>
      <FormLabel>
        {t('students.ENTER_ADDRESS')}
      </FormLabel>
      <Input
        value={address}
        onChange={(event) => {
          setAddress(event.target.value as `0x${string}`);
        }}
      />
      <FormErrorMessage>{t('students.ENTER_VALID_ADDRESS')}</FormErrorMessage>
    </FormControl>
    <Button
      type={'submit'} my={5} colorScheme={'blue'}
      isLoading={contractWriteLoading}
      isDisabled={isInvalid || address === '0x'}
    >{t('students.ADD_STUDENT')}</Button>
  </form>);
};

export const StudentManager = () => {
  const { t } = useTranslation('admin');
  return (<>
    <Container maxW={'container.lg'}>
      <Heading mb={5}>{t('students.HEADING')}</Heading>
      <Stack spacing={10}>
        <AddSingleStudentForm />
        <hr />
        <hr />
        <hr />
      </Stack>
    </Container>
  </>);
};
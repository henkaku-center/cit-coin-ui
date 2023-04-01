import { Button, Container, FormControl, FormErrorMessage, FormLabel, Heading, Input, Stack } from '@chakra-ui/react';
import useTranslation from 'next-translate/useTranslation';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import LearnToEarnABI from '@/utils/abis/LearnToEarn.json';
import { getContractAddress } from '@/utils/contract';
import { useState } from 'react';
import { isAddress } from '@ethersproject/address';

const AddSingleStudentForm = () => {
  const LearnToEarnAddress = getContractAddress('LearnToEarn');
  const { t } = useTranslation('admin');
  const [studentAddress, setStudentAddress] = useState<`0x${string}`>('0x');

  const { config, error: configError } = usePrepareContractWrite({
    address: LearnToEarnAddress,
    functionName: 'addStudent',
    args: [studentAddress],
    abi: LearnToEarnABI,
    enabled: isAddress(studentAddress),
  });
  const {
    write: ContractWrite,
    isLoading: contractWriteLoading,
  } = useContractWrite(config);

  return (<form onSubmit={(event) => {
    event.preventDefault();
    ContractWrite?.();
  }}>
    <FormControl isInvalid={!(isAddress(studentAddress) || studentAddress == '0x')}>
      <FormLabel>
        {t('students.ENTER_ADDRESS')}
      </FormLabel>
      <Input
        fontFamily={'mono'}
        value={studentAddress}
        onChange={(event) => {
          setStudentAddress(event.target.value as `0x${string}`);
        }}
      />
      <FormErrorMessage>{t('students.ENTER_VALID_ADDRESS')}</FormErrorMessage>
    </FormControl>
    <Button
      type={'submit'} my={5} colorScheme={'blue'}
      isLoading={contractWriteLoading}
      isDisabled={(!!configError || !isAddress(studentAddress))}
    >{t('students.ADD_STUDENT')}</Button>
    {/*{JSON.stringify(config)}*/}
    <hr />
  </form>);
};


const AddMultipleStudentForm = () => {
  const { t } = useTranslation('admin');

  return (<form onSubmit={(event) => {
    event.preventDefault();
    // ContractWrite?.();
  }}>
    <FormControl isInvalid={false}>
      {/*todo: change later*/}
      <FormLabel>
        {t('students.ENTER_ADDRESS')}
      </FormLabel>
      <Input
        fontFamily={'mono'}
        // value={studentAddress}
        // onChange={(event) => {
        //   setStudentAddress(event.target.value as `0x${string}`);
        // }}
      />
      <FormErrorMessage>{t('students.ENTER_VALID_ADDRESS')}</FormErrorMessage>
    </FormControl>
    <Button
      type={'submit'} my={5} colorScheme={'blue'}
      // isLoading={contractWriteLoading}
      // isDisabled={(!!configError || !isAddress(studentAddress))}
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
        <AddMultipleStudentForm/>
        <hr />
        <hr />
      </Stack>
    </Container>
  </>);
};
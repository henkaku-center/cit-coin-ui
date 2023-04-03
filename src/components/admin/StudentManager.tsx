import {
  Badge,
  Box,
  Button,
  Container, Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading, Icon,
  Input,
  Stack, Text, useToast,
} from '@chakra-ui/react';
import useTranslation from 'next-translate/useTranslation';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import LearnToEarnABI from '@/utils/abis/LearnToEarn.json';
import { getContractAddress } from '@/utils/contract';
import { useEffect, useState } from 'react';
import { isAddress } from '@ethersproject/address';
import { useDropzone } from 'react-dropzone';
import { FaFile } from 'react-icons/fa';
import { parse } from 'csv-parse';

const LearnToEarnAddress = getContractAddress('LearnToEarn');

const AddSingleStudentForm = () => {

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
  const toast = useToast();
  const [addresses, setAddresses] = useState<string[]>([]);
  const { acceptedFiles, getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    accept: {
      'application/csv': ['.csv'],
    },
    maxFiles: 1,
    // maxSize: 1024000
  });

  const { config, error: configError } = usePrepareContractWrite({
    address: LearnToEarnAddress,
    functionName: 'addStudents',
    args: [addresses],
    abi: LearnToEarnABI,
    enabled: !!addresses.length,
  });
  const {
    write: ContractWrite,
    isLoading: contractWriteLoading,
  } = useContractWrite(config);

  const parseCsv = (data: string) => {
    const parser = parse(data);
    let records: string[] = [];
    parser.on('readable', () => {
      let record: string[];
      while ((record = parser.read()) !== null) {
        let address = record[0];
        if (isAddress(address)) {
          records.push(address);
        }
      }
      if (!records.length) {
        toast({
          title: t('toast.INVALID_DATA_TITLE'),
          duration: 5000,
          isClosable: true,
          position: 'top',
          status: 'error',
          description: 'Could not find any wallet address in the first column of the CSV file.',
        });
      } else {
        setAddresses(records);
      }
      console.log(records);
    });
  };

  useEffect(() => {
    console.log('Accepted files: ', acceptedFiles);
    console.log(acceptedFiles);
    if (acceptedFiles.length) {
      acceptedFiles[0].arrayBuffer().then(buffer => {
        let string_data = new TextDecoder().decode(buffer);
        parseCsv(string_data);
      });
    }
  }, [acceptedFiles]);

  return (<>
    <Heading fontSize={'lg'} mb={3}>Add Multiple Students</Heading>
    <Flex
      {...getRootProps()}
      border={'dashed 3px'} borderColor={'blue.500'}
      minH={'8em'} borderRadius={10}
      alignItems={'center'}
      justifyContent={'center'}
    >
      {acceptedFiles.length ? <>
        {acceptedFiles.map((file, index) =>
          <Text key={index} p={3} borderWidth={'1px'} borderRadius={'lg'}>
            <Icon as={FaFile} mr={2} />{file.name}
          </Text>,
        )}
      </> : <>
        <Icon as={FaFile} mr={2} />
        <Text>Drag and drop CSV file, or click to select file</Text>
      </>}
      <input {...getInputProps()} />
    </Flex>
    <Button
      isDisabled={!addresses.length}
      type={'submit'} my={5} colorScheme={'blue'} onClick={() => {
      ContractWrite?.()
    }}
    >{t('students.ADD_STUDENT')}</Button>
    <Box textAlign={'center'}>
      {addresses.map((address) => (
        <Badge
          colorScheme={'green'} key={address} py={1} px={2} m={1} borderWidth={'1px'}
          borderRadius={'full'} fontFamily={'mono'}
        >
          {address}
        </Badge>
      ))}
    </Box>
  </>);
};

export const StudentManager = () => {
  const { t } = useTranslation('admin');
  return (<>
    <Container maxW={'container.lg'}>
      <Heading mb={5}>{t('students.HEADING')}</Heading>
      <Stack spacing={10}>
        <AddSingleStudentForm />
        <hr />
        <AddMultipleStudentForm />
      </Stack>
    </Container>
  </>);
};
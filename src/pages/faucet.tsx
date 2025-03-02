import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Checkbox,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import useTranslation from 'next-translate/useTranslation';
import { Fragment, useEffect, useState } from 'react';
import { formatUnits, isAddress } from 'ethers/lib/utils';
import axios from 'axios';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { useAccount, useReadContracts } from 'wagmi';
import { ApiError } from '@/types';
import { BigNumber, BigNumberish } from 'ethers';
import FaucetABI from '@/utils/abis/Faucet.json';
import { formatDuration } from '@/utils/timeUtils';
import { CryptoLink } from '@/components/CryptoLink';

const FaucetPage = () => {
  const { t } = useTranslation('common');
  const { chain } = useAccount();
  const { address, isConnected } = useAccount();
  const [checked, setChecked] = useState<boolean>(false);
  const [newAddress, setNewAddress] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [txn, setTxn] = useState<`0x${string}` | null>(null);
  const toast = useToast();
  const faucetAddress = (process.env.NEXT_PUBLIC_FAUCET_ADDRESS || '') as `0x${string}`;
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
    ],
  });

  const [lockDuration, locked, offering] = data
    ? data.map((d) => d.result)
    : [0, true, BigNumber.from(0)];

  const faqs = [
    {
      question: 'What is Faucet?',
      answer: `To request funds, simply enter your wallet address and hit “Send Me OP. We
        support wallets as received addresses but not smart contracts.`,
    },
    {
      question: 'How do I use this?',
      answer: 'To use it, you must enroll to a class and answer weekly quests.',
    },
    {
      question: 'How does it work?',
      answer: `You can request ${formatUnits((offering as BigNumberish) ?? '0', 18)}
      OP if the faucet is unlocked. The current unlock duration is
      ${formatDuration(Number(lockDuration))} after your successful request.`,
    },
  ];

  useEffect(() => {
    if (!checked && address) {
      setNewAddress(address);
    }
  }, [checked, address]);
  return (
    <>
      <Heading textAlign={'center'}>{t('faucet.HEADING')}</Heading>
      <Container maxW={'container.md'} py={10}>
        <Card variant={'filled'} mb={10}>
          <CardBody>
            {address && isConnected && (
              <Stack mb={5}>
                <Text>{t('faucet.SEND_CRYPTO_AT')}</Text>
                <Badge
                  mb={5}
                  fontSize={'lg'}
                  textAlign={'center'}
                  fontFamily={'mono'}
                  colorScheme={checked ? 'gray' : 'green'}
                  opacity={checked ? 0.5 : 1}
                >
                  {address}
                </Badge>
                <Checkbox
                  onChange={(e) => {
                    setChecked(e.target.checked);
                  }}
                >
                  {t('faucet.USE_ANOTHER_WALLET')}
                </Checkbox>
              </Stack>
            )}
            {(!isConnected || checked) && (
              <FormControl mb={5}>
                <FormLabel>{t('faucet.ADDRESS_LABEL')}</FormLabel>
                <Input
                  isDisabled={locked as boolean}
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder={'0x00000000000000000000'}
                  size={'lg'}
                  fontFamily={'mono'}
                />
                <FormHelperText>{t('faucet.ADDRESS_HELP_TEXT')}</FormHelperText>
              </FormControl>
            )}
            <FormControl>
              <Button
                isDisabled={!isAddress(newAddress) || (locked as boolean)}
                isLoading={loading}
                size={'lg'}
                px={8}
                colorScheme={locked ? 'red' : 'blue'}
                borderRadius={'full'}
                width={'full'}
                onClick={() => {
                  setLoading(true);
                  axios
                    .post('/api/faucet/', { address: newAddress })
                    .then((resp) => {
                      toast({
                        position: 'top',
                        status: 'success',
                        title: t('faucet.TOKEN_CLAIM_SUCCESS'),
                        description: t('faucet.TOKEN_CLAIM_SUCCESS_DESCRIPTION'),
                        isClosable: true,
                        duration: 5000,
                      });
                      setTxn(resp.data.data.transaction.hash);
                    })
                    .catch((err: ApiError) => {
                      const errorInfo = {
                        errorCode: err.code,
                        message: err.message,
                        data: err.data,
                      };
                      console.error(JSON.stringify(errorInfo));
                      toast({
                        position: 'top',
                        status: 'error',
                        title: t(err.response.data.code ?? 'faucet.TOKEN_CLAIM_ERROR'),
                        description: t(
                          err.response.data.details?.error?.reason ??
                            'faucet.TOKEN_CLAIM_ERROR_DESCRIPTION',
                        ),
                        isClosable: true,
                        duration: 5000,
                      });
                    })
                    .finally(() => {
                      setLoading(false);
                    });
                }}
              >
                {t(locked ? 'faucet.LOCKED' : 'faucet.GET_CRYPTO_COINS')}
              </Button>
            </FormControl>
          </CardBody>
          <CardFooter>
            {txn && (
              <Box>
                <Text mr={2} fontWeight={'bold'}>
                  Transaction Hash:
                </Text>
                <CryptoLink type="tx" value={txn} colorScheme="blue">
                  {txn}
                </CryptoLink>
              </Box>
            )}
          </CardFooter>
        </Card>
        <HStack my={5}>
          <Text minWidth={'120px'}>{t('faucet.LOCK_DURATION')}:</Text>
          <Badge colorScheme={'red'} borderRadius={'full'} px={5} py={1}>
            {formatDuration(Number(lockDuration), 'en')}
          </Badge>
        </HStack>
        <HStack my={5}>
          <Text minWidth={'120px'}>{t('faucet.OFFERING')}:</Text>
          <Badge colorScheme={'red'} borderRadius={'full'} px={5} py={1}>
            {formatUnits((offering as BigNumberish) ?? '0', 18)} OP
          </Badge>
        </HStack>
        <Box>
          <Heading fontSize={'lg'} mb={8}>
            FAQs
          </Heading>
          {faqs.map(({ question, answer }, index) => (
            <Fragment key={index}>
              <Text fontSize={'md'} mb={3} fontWeight={'bold'}>
                {question}
              </Text>
              <Text mb={5}>{answer}</Text>
            </Fragment>
          ))}
        </Box>
      </Container>
    </>
  );
};
export default FaucetPage;

import {
  Box,
  Button,
  Card,
  CardBody, CardFooter,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading, HStack,
  Input, Link, Text, useToast,
} from '@chakra-ui/react';
import useTranslation from 'next-translate/useTranslation';
import { Fragment, useState } from 'react';
import { isAddress } from 'ethers/lib/utils';
import axios from 'axios';
import NextLink from 'next/link';
import { ExternalLinkIcon } from '@chakra-ui/icons';

const FaucetPage = () => {
  const { t } = useTranslation('common');
  const faqs = [
    {
      question: 'What is Faucet?',
      answer: 'To request funds, simply enter your wallet address and hit “Send Me MATIC”. We support wallets as received addresses but not smart contracts.',
    },
    {
      question: 'How do I use this?',
      answer: 'To use it, you must enroll to a class and answer weekly quests.',
    },
    {
      question: 'How does it work?',
      answer: `You can request 0.5 MATIC every 24h once you get authenticated. This matic is used to answer the
       quests that are added to the polygon mainnet.`,
    },
  ];
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [txn, setTxn] = useState<string>('');
  const toast = useToast();
  return (
    <>
      <Heading textAlign={'center'}>Pitpa Faucet</Heading>
      <Container maxW={'container.md'} py={10}>
        <Card variant={'filled'} mb={10}>
          <CardBody>
            <FormControl mb={5}>
              <FormLabel>{t('faucet.ADDRESS_LABEL')}</FormLabel>
              <HStack spacing={0}>
                <Input
                  value={address} onChange={e => setAddress(e.target.value)}
                  placeholder={'0x00000000000000000000'}
                  size={'lg'} borderLeftRadius={'full'} fontFamily={'mono'} />
                <Button
                  isDisabled={!isAddress(address)}
                  isLoading={loading}
                  size={'lg'} px={8}
                  colorScheme={'blue'}
                  borderRightRadius={'full'}
                  onClick={() => {
                    setLoading(true);
                    axios.post('/api/faucet/', { address }).then((resp) => {
                      toast({
                        position: 'top',
                        status: 'success',
                        title: t('faucet.TOKEN_CLAIM_SUCCESS'),
                        description: t('faucet.TOKEN_CLAIM_SUCCESS_DESCRIPTION'),
                      });
                      setTxn(resp.data.data.transaction.hash);
                    }).catch((err) => {
                      toast({
                        position: 'top',
                        status: 'error',
                        title: t('faucet.TOKEN_CLAIM_ERROR'),
                        description: t('faucet.TOKEN_CLAIM_ERROR_DESCRIPTION'),
                      });
                    }).finally(() => {
                      setLoading(false);
                    });
                  }}
                >
                  {t('faucet.GET_MATIC_COINS')}
                </Button>
              </HStack>
              <FormHelperText>{t('faucet.ADDRESS_HELP_TEXT')}</FormHelperText>
            </FormControl>
          </CardBody>
          <CardFooter>
            {txn && <Box>
              <Text mr={2} fontWeight={'bold'}>Transaction Hash:</Text>
              <Link
                href={`https://${process.env.NEXT_PUBLIC_NODE_ENV === 'production' ? '' : 'mumbai.'}polygonscan.com/tx/${txn}`}
                isExternal={true}
                textDecoration={'underline 1px'}
                textDecorationColor={'blue.500'}
                color={'blue.500'}
              >
                {txn}
                <ExternalLinkIcon mx={2}/>
              </Link>
            </Box>}
          </CardFooter>
        </Card>
        <Box>
          <Heading fontSize={'lg'} mb={8}>FAQs</Heading>
          {faqs.map(({ question, answer }, index) => (
            <Fragment key={index}>
              <Text fontSize={'md'} mb={3} fontWeight={'bold'}>{question}</Text>
              <Text mb={5}>{answer}</Text>
            </Fragment>
          ))}
        </Box>

      </Container>
    </>
  );
};
export default FaucetPage;
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
  Input, Text,
} from '@chakra-ui/react';
import useTranslation from 'next-translate/useTranslation';

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
  return (
    <>
      <Heading textAlign={'center'}>Pitpa Faucet</Heading>
      <Container maxW={'container.md'} py={10}>
        <Card variant={'filled'} mb={10}>
          <CardBody>
            <FormControl mb={5}>
              <FormLabel>{t('faucet.ADDRESS_LABEL')}</FormLabel>
              <Input placeholder={'0x00000000000000000000'} size={'lg'} borderRadius={'full'} fontFamily={'mono'}/>
              <FormHelperText>{t('faucet.ADDRESS_HELP_TEXT')}</FormHelperText>
            </FormControl>
          </CardBody>
          <CardFooter as={HStack} flexDirection={'row-reverse'}>
            <Button>
              {t('faucet.GET_MATIC_COINS')}
            </Button>
          </CardFooter>
        </Card>

        <Box>
          <Heading fontSize={'lg'} mb={8}>FAQs</Heading>
          {faqs.map(({ question, answer }, index) => (
            <>
              <Text fontSize={'md'} mb={3} fontWeight={'bold'}>{question}</Text>
              <Text mb={5}>{answer}</Text>
            </>
          ))}
        </Box>

      </Container>
    </>
  );
};
export default FaucetPage;
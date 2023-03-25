import { Container, FormControl, FormHelperText, FormLabel, Heading, Input } from '@chakra-ui/react';
import useTranslation from 'next-translate/useTranslation';

const FaucetPage = () => {
  const { t } = useTranslation('common');
  return (
    <>
      <Heading>Faucet</Heading>
      <Container size={'xl'} py={10}>
        <FormControl>
          <FormLabel>{t('faucet.ADDRESS_LABEL')}</FormLabel>
          <Input placeholder={'0x00000000000000000000'} size={'lg'} borderRadius={'full'}/>
          <FormHelperText>{t('faucet.ADDRESS_HELP_TEXT')}</FormHelperText>
          <FormHelperText>{t('faucet.ADDRESS_HELP_TEXT')}</FormHelperText>
        </FormControl>
      </Container>
    </>
  );
};
export default FaucetPage;
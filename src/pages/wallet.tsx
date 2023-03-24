import { Box, Container } from '@chakra-ui/react';
// import useTranslation from 'next-translate/useTranslation'
import { Profile } from '@/components/wallet';

const Wallet = () => {
  // const { t } = useTranslation('common')
  return (
    <Box py={20}>
      <Container maxW={'container.md'}>
        <Profile />
      </Container>
    </Box>
  );
};

export default Wallet;
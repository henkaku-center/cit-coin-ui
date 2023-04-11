import {
  Box,
  Stack,
} from '@chakra-ui/react';
import { ContractDetail } from '@/components/wallet';
import Footer from '@/components/Footer';

const Home = () => {
  return (
    <>
      <Box p={10} minH={'70vh'}>
        <Stack alignItems={'center'}>
          <ContractDetail />
        </Stack>
      </Box>
      <Footer />
    </>
  );
};

export default Home;

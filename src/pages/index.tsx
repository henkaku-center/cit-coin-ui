import {
  Box,
  Stack,
} from '@chakra-ui/react';
import { ContractDetail } from '@/components/wallet';

const Home = () => {
  return (
    <Box p={10}>
      <Stack alignItems={"center"}>
        <ContractDetail />
      </Stack>
    </Box>
  );
};

export default Home;

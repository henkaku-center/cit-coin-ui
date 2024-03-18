import { Wrap, WrapItem } from '@chakra-ui/react';
import { ContractDetail } from '@/components/wallet';
import Footer from '@/components/Footer';
import { AssetLibrary } from '@/components/NFT';

const Home = () => {
  return (
    <>
      <Wrap m={5} justify={'center'}>
        <WrapItem w={{ base: 'full', lg: '45%' }}>
          <ContractDetail />
        </WrapItem>
        <WrapItem w={{ base: 'full', lg: '50%' }}>
          <AssetLibrary />
        </WrapItem>
      </Wrap>
      <Footer />
    </>
  );
};

export default Home;

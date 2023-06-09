import {
  Alert,
  Box,
  Button,
  Heading,
  HStack,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stack,
  useDisclosure, useToast,
  VStack, Wrap, WrapItem,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import useTranslation from 'next-translate/useTranslation';
import { useAccount } from 'wagmi';
import { PinataPinnedResponse } from '@/types/pinata.types';

interface Asset {
  title: string;
  description: string;
  url: string;
  earning: number;
}

const AssetCard = (props: { asset: Asset }) => {
  const { asset } = props;
  return (
    <Box position={'relative'}>
      <Box
        bg={'orange.400'} color={'white'}
        position={'absolute'}
        top={5} right={0} px={1}
        borderLeftRadius={'full'}
        textAlign={'right'}
        fontSize={'xs'}
        shadow={'dark-lg'}
      >
        {asset.earning} cJPY
      </Box>
      <Image minW={150} minH={150} width={100} src={asset.url} alt={asset.title} />
    </Box>
  );
};


export const AssetLibrary = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation('default');

  const [loading, setLoading] = useState(false);
  const { address, connector, isConnected } = useAccount();
  // const [pinResp, setPinResp] = useState<PinataPinnedResponse | null>(null);
  const [pinResp, setPinResp] = useState<PinataPinnedResponse | null>(null);
  const toast = useToast();

  useEffect(() => {
    axios.get('/api/nft').then((resp) => {
      setAssets(resp.data.results);
    });
  }, []);

  return (
    <>
      <VStack width={'full'}>
        <Alert variant={'subtle'} status={'info'}>
          <Heading>Available NFTs</Heading>
        </Alert>
        <HStack>
          {assets.map((asset, index) => (
            <AssetCard key={index} asset={asset} />
          ))}
        </HStack>

        <Button
          colorScheme={'green'} w={'full'} isDisabled={!address} isLoading={loading}
          onClick={(event) => {
            setLoading(true);
            axios.post('/api/nft', {
              address: address,
            }).then((resp) => {
              setPinResp(resp.data);
              onOpen();
            }).catch((err) => {
              console.log(err);
              toast({
                status: 'error',
                position: 'top',
                isClosable: true,
                title: err.response.data.code ?? 'Error completing request',
                description: err.response.data.message ?? 'We\'re unable to process your request, please try again later.',
              });
            }).finally(() => {
              setLoading(false);
            });
          }}>{t('CLAIM_REWARDS')}</Button>
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose} size={'2xl'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Congratulations !! You&apos;ve successfully earned an NFT
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Wrap>
              <WrapItem width={{ base: 'full', lg: '48%' }} p={{ base: 5 }}>
                <Stack width={'full'}>
                  <Box
                    as={Link}
                    target={'_blank'}
                    href={`https://gateway.pinata.cloud/ipfs/${pinResp?.IpfsHash}`}
                    color={'orange'}>
                    {pinResp?.IpfsHash}
                  </Box>
                  <Box>Pin Size: {pinResp?.PinSize}</Box>
                  {pinResp?.Timestamp && <Box>Created: {(new Date(pinResp.Timestamp)).toLocaleString()}</Box>}
                  <Spacer />
                  <Button
                    colorScheme={'orange'}
                    as={Link} target={'_blank'} href={`https://gateway.pinata.cloud/ipfs/${pinResp?.IpfsHash}`}
                  >
                    Preview Full Size Image
                  </Button>
                </Stack>
              </WrapItem>
              <WrapItem
                as={Link} width={{ base: 'full', lg: '48%' }}
                href={`https://gateway.pinata.cloud/ipfs/${pinResp?.IpfsHash}`}
                target={'_blank'} justifyContent={{ base: 'center', lg: 'end' }}
              >
                {pinResp && <Image
                  src={`https://gateway.pinata.cloud/ipfs/${pinResp.IpfsHash}`}
                  alt={pinResp.IpfsHash} minW={200} width={300} height={300}
                  objectFit={'contain'}
                />}
              </WrapItem>
            </Wrap>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
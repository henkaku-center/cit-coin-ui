import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  HStack,
  Image,
  Input, Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  Spacer,
  Stack,
  Text,
  useDisclosure, useToast,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import useTranslation from 'next-translate/useTranslation';
import { useAccount } from 'wagmi';
import { PinataPinnedResponse } from '@/types/pinata.types';
import { IpfsUtils } from '@/utils';

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
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Congratulations !! You&apos;ve successfully earned an NFT
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              {pinResp && <Image
                src={`https://gateway.pinata.cloud/ipfs/${pinResp.IpfsHash}`}
                alt={pinResp.IpfsHash} minW={300} width={400} height={400}
              />}
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Link target={'_blank'} href={`https://gateway.pinata.cloud/ipfs/${pinResp?.IpfsHash}`}>
              Click to preview full
            </Link>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
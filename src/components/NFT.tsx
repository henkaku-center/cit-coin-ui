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
  Input,
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
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import useTranslation from 'next-translate/useTranslation';

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
  const [score, setScore] = useState('test');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { t } = useTranslation('default');


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

        <Button colorScheme={'green'} w={'full'} onClick={onOpen}>{t('CLAIM_REWARDS')}</Button>
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Preview
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              <form onSubmit={(e) => {
                e.preventDefault();
                axios.post('/api/nft/', {
                  score: score,
                }, { responseType: 'arraybuffer' }).then(resp => {
                  const blob = new Blob([resp.data], { type: 'image/png' });
                  setImageUrl(URL.createObjectURL(blob));
                });
              }}>
                <HStack spacing={0} mb={5}>
                  <Input borderLeftRadius={'full'} width={300} type={'number'} value={score} onChange={(e) => {
                    setScore(e.target.value);
                  }}></Input>
                  <Button width={100} colorScheme={'blue'} type={'submit'} borderRightRadius={'full'}>Render</Button>
                </HStack>
              </form>
              {imageUrl && <Image src={imageUrl} alt={score} minW={300} width={400} height={400} />}
            </Stack>

          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
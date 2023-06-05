import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading, HStack,
  Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
  Stack,
  Text, useDisclosure,
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
    <Card position={'relative'} overflow={'hidden'} width={'full'} variant={'elevated'}>
      <Badge
        colorScheme={'orange'}
        position={'absolute'}
        top={'20px'}
        right={0}
        p={1} px={3}
        borderLeftRadius={'full'}
        // minW={'120px'}
        // fontSize={'md'}
        textAlign={'right'}
      >
        {asset.earning} cJPY
      </Badge>
      <CardHeader>
        {asset.title}
      </CardHeader>
      <CardBody display={'flex'} justifyContent={'center'}>
        <Image minW={180} minH={180} width={200} src={asset.url} alt={asset.title} />
      </CardBody>
      {/*<CardFooter>*/}
      {/*  {asset.description}*/}
      {/*</CardFooter>*/}
    </Card>
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
      <Modal isOpen={isOpen} onClose={onClose} size={'2xl'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {imageUrl && <Image src={imageUrl} alt={score} />}
          </ModalBody>
          <ModalFooter>
            <form onSubmit={(e) => {
              e.preventDefault();
              axios.post('/api/nft/', {
                score: score,
              }, { responseType: 'arraybuffer' }).then(resp => {
                const blob = new Blob([resp.data], { type: 'image/png' });
                setImageUrl(URL.createObjectURL(blob));
              });
            }}>
              <Input value={score} onChange={(e) => {
                setScore(e.target.value);
              }}></Input>
              <Button type={'submit'}>Render</Button>
            </form>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
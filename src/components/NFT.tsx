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
  Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
  Stack,
  Text, useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Asset {
  title: string;
  description: string;
  url: string;
  earning: number;
}

const AssetCard = (props: { asset: Asset }) => {
  const { asset } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [value, setValue] = useState('test');

  const [svg, setSvg] = useState('');

  return (
    <Card direction={'row'} position={'relative'} overflow={'hidden'} width={'full'} variant={'elevated'}>
      <Badge
        colorScheme={'orange'}
        position={'absolute'}
        top={'20px'}
        right={0}
        p={1} px={3}
        borderLeftRadius={'full'}
        minW={'120px'}
        fontSize={'md'}
        textAlign={'right'}
      >
        {asset.earning} cJPY
      </Badge>
      <CardHeader>
        <Image minW={100} minH={100} width={100} src={asset.url} placeholder={asset.title} />
      </CardHeader>
      <Stack w={'full'}>
        <CardBody>
          <Heading fontSize={'xl'} mb={4}>{asset.title}</Heading>
          <Text>{asset.description}</Text>
          <Button colorScheme={'green'} w={'full'} onClick={onOpen}>Preview and Check Eligibility</Button>
        </CardBody>
      </Stack>

      <Modal isOpen={isOpen} onClose={onClose} size={'2xl'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box dangerouslySetInnerHTML={{__html: svg}}/>
            {/*{svg}*/}
            {/*<Lorem count={2} />*/}
          </ModalBody>

          <ModalFooter>
            <form onSubmit={(e) => {
              e.preventDefault();
              axios.post('/api/nft/', {
                level: value,
              }).then(resp => {
                setSvg(resp.data.svg);
              });
            }}>
              <Input value={value} onChange={(e)=>{
                setValue(e.target.value)
              }}></Input>
              <Button type={'submit'}>Render</Button>
            </form>
            {/*<Button colorSchseme='blue' mr={3} onClick={onClose}>*/}
            {/*  Close*/}
            {/*</Button>*/}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
};


export const AssetLibrary = () => {
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    axios.get('/api/nft').then((resp) => {
      setAssets(resp.data.results);
    });
  }, []);

  return (
    <VStack width={'full'}>
      <Alert variant={'subtle'} status={'info'}>
        <Heading>Available NFTs</Heading>
      </Alert>
      {assets.map((asset, index) => (
        <AssetCard key={index} asset={asset} />
      ))}
    </VStack>
  );
};
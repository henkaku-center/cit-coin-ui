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
  Image,
  Stack,
  Text,
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
          <Button colorScheme={'green'} w={'full'}>Check Eligibility</Button>
        </CardBody>
      </Stack>
    </Card>
  );
};


export const AssetLibrary = () => {
  const [assets, setAssets] = useState<Asset[]>([])
  useEffect(() => {
    axios.get('/api/nft').then((resp)=>{
      setAssets(resp.data.results)
    })
  });
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
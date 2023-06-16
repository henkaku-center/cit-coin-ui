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
  Stack, Text,
  useDisclosure, useToast,
  VStack, Wrap, WrapItem,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import useTranslation from 'next-translate/useTranslation';
import { useAccount, useBalance, useContractRead, useContractWrite, useNetwork, usePrepareContractWrite } from 'wagmi';
import { PinataPinnedResponse } from '@/types/pinata.types';
import { getContractAddress } from '@/utils/contract';
import { UseContractConfig } from '@/hooks';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { formatUnits, parseUnits } from 'ethers/lib/utils';

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
  const { chain } = useNetwork();
  const [assets, setAssets] = useState<Asset[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation('default');
  const [loading, setLoading] = useState(false);
  const { address, connector, isConnected } = useAccount();
  const [pinResp, setPinResp] = useState<PinataPinnedResponse | null>(null);
  const toast = useToast();
  const { contractAddress: citCoinAddress, abi: citCoinAbi } = UseContractConfig('CitCoin');
  const { contractAddress: citNFTAddress, abi: citNFTAbi } = UseContractConfig('NFT');
  const balance = useTokenBalance({ address, tokenAddress: citCoinAddress });

  const citCoinConfig = {
    address: citCoinAddress,
    abi: citCoinAbi,
    chainId: chain?.id,
  };

  const { data: allowance } = useContractRead({
    ...citCoinConfig,
    functionName: 'allowance',
    args: [address, citNFTAddress],
  });

  const { config: ApproveConfig, isError: contractConfigError } = usePrepareContractWrite({
    ...citCoinConfig,
    functionName: 'approve',
    args: [citNFTAddress, balance?.value],
  });
  const {
    write: approve,
    isLoading: contractWriteLoading,
    isError: contractWriteError,
  } = useContractWrite(ApproveConfig);


  const {
    config: mintNFTConfig,
    isError: isMintConfigError,
  } = usePrepareContractWrite({
    address: citNFTAddress,
    abi: citNFTAbi,
    chainId: chain?.id,
    functionName: 'mint',
    args: [`https://gateway.pinata.cloud/ipfs/${pinResp?.IpfsHash}`],
  });

  const {
    write: mintNFT,
    isLoading: isMinting,
    isError: isMintError,
  } = useContractWrite(mintNFTConfig);

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
        <hr />
        {/*@ts-ignore*/}
        <Text>Current Allowance: {formatUnits(allowance??'0', )}</Text>
        {/*@ts-ignore*/}
        {balance?.value && allowance && allowance < balance?.value && <Button
          colorScheme={'red'}
          onClick={() => {
            approve?.();
          }}
          isLoading={contractWriteLoading}
        >
          Allow Spending {formatUnits(balance?.value ?? 0, 18)} {balance?.symbol} to get NFT
        </Button>}
        {/*@ts-ignore*/}
        {balance?.value && allowance && allowance >= balance?.value && <Button
          colorScheme={'green'} w={'full'}
          isDisabled={!address || contractConfigError}
          isLoading={loading}
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
          }}>Render Generated Graphics</Button>}
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose} size={'2xl'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Congratulations !! You&apos;ve successfully rendered the NFT Graphics
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
                    isDisabled={isMintConfigError}
                    isLoading={isMinting}
                    colorScheme={'orange'}
                    onClick={() => {
                      mintNFT?.();
                    }}
                  >
                    Claim This NFT
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
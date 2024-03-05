import {
  Alert,
  Badge,
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
  Text,
  useDisclosure,
  useToast,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import useTranslation from 'next-translate/useTranslation';
import { useAccount, useReadContract, useWriteContract, useSimulateContract } from 'wagmi';
import { NftPinResponse } from '@/types/pinata.types';
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
        bg={'orange.400'}
        color={'white'}
        position={'absolute'}
        top={5}
        right={0}
        px={1}
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
  const { t } = useTranslation('common');
  const [loading, setLoading] = useState(false);
  const { address, connector, isConnected, chain } = useAccount();
  const [pinResp, setPinResp] = useState<NftPinResponse | undefined>(undefined);
  const toast = useToast();
  const { contractAddress: citCoinAddress, abi: citCoinAbi } = UseContractConfig('CitCoin');
  const { contractAddress: citNFTAddress, abi: citNFTAbi } = UseContractConfig('NFT');
  const balance = useTokenBalance({ address, tokenAddress: citCoinAddress });

  const citCoinConfig = {
    address: citCoinAddress,
    abi: citCoinAbi,
    chainId: chain?.id,
  };

  const { data: allowance } = useReadContract({
    ...citCoinConfig,
    functionName: 'allowance',
    args: [address, citNFTAddress],
    watch: true,
  });

  const { data: isNftLocked } = useReadContract({
    abi: citNFTAbi,
    chainId: chain?.id,
    functionName: 'locked',
    address: citNFTAddress,
  });

  const { config: ApproveConfig, isError: contractConfigError } = useSimulateContract({
    ...citCoinConfig,
    functionName: 'approve',
    args: [citNFTAddress, balance?.value ?? '0'],
  });
  const {
    write: approve,
    isLoading: contractWriteLoading,
    isError: contractWriteError,
  } = useWriteContract(ApproveConfig);

  const { config: mintNFTConfig, isError: isMintConfigError } = useSimulateContract({
    address: citNFTAddress,
    abi: citNFTAbi,
    chainId: chain?.id,
    functionName: 'mint',
    args: [pinResp?.tokenUri],
  });

  const {
    write: mintNFT,
    isLoading: isMinting,
    isError: isMintError,
  } = useWriteContract(mintNFTConfig);

  //@ts-ignore
  const formattedAllowance = parseFloat(formatUnits(allowance ?? '0', 18));
  //@ts-ignore
  const formattedBalance = parseFloat(formatUnits(balance?.value ?? '0', 18));

  useEffect(() => {
    axios.get('/api/nft').then((resp) => {
      setAssets(resp.data.results);
    });
  }, []);

  return (
    <>
      <VStack width={'full'}>
        <Alert variant={'subtle'} status={'info'}>
          <Heading>{t('nft.AVAILABLE')}</Heading>
        </Alert>
        <Alert status={'warning'} variant={'left-accent'}>
          {t('nft.ALLOWANCE_WARNING')}
        </Alert>
        <HStack>
          {assets.map((asset, index) => (
            <AssetCard key={index} asset={asset} />
          ))}
        </HStack>
        {isNftLocked && (
          <Alert variant={'subtle'} status={'error'}>
            The NFT is currently Locked, please try again later to claim yours!!
          </Alert>
        )}
        {!isNftLocked && (
          <Box py={5} px={3} textAlign={'center'}>
            <Text>
              {t('nft.CURRENT_ALLOWANCE')}:{' '}
              <Badge colorScheme={'green'} px={2} borderRadius={'full'}>
                {formattedAllowance} cJPY
              </Badge>
            </Text>
            <Text>
              {t('nft.CURRENT_BALANCE')}:{' '}
              <Badge colorScheme={'green'} px={2} borderRadius={'full'}>
                {formattedBalance} cJPY
              </Badge>
            </Text>
            {formattedBalance > 0 && formattedAllowance < formattedBalance && (
              <>
                <Button
                  colorScheme={'red'}
                  onClick={() => {
                    approve?.();
                  }}
                  isLoading={contractWriteLoading}
                  m={3}
                  w={'full'}
                >
                  Allow Spending {formattedBalance} {balance?.symbol} to get NFT
                </Button>
              </>
            )}
            {/*@ts-ignore*/}
            {formattedBalance > 0 &&
              formattedAllowance > 0 &&
              formattedAllowance >= formattedBalance && (
                <Button
                  colorScheme={'green'}
                  w={'full'}
                  isDisabled={!address || contractConfigError}
                  isLoading={loading}
                  onClick={(event) => {
                    setLoading(true);
                    axios
                      .post('/api/nft', {
                        address: address,
                      })
                      .then((resp) => {
                        setPinResp(resp.data);
                        onOpen();
                      })
                      .catch((err) => {
                        toast({
                          status: 'error',
                          position: 'top',
                          isClosable: true,
                          title: err.response.data.code ?? 'Error completing request',
                          description:
                            err.response.data.message ??
                            "We're unable to process your request, please try again later.",
                        });
                      })
                      .finally(() => {
                        setLoading(false);
                      });
                  }}
                >
                  Render Generated Graphics
                </Button>
              )}
          </Box>
        )}
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
                    href={pinResp?.nft.image}
                    // href={`https://gateway.pinata.cloud/ipfs/${pinResp?.IpfsHash}`}
                    color={'orange'}
                  >
                    {pinResp?.nft.image}
                    {/*{pinResp?.IpfsHash}*/}
                  </Box>
                  <Box>Name: {pinResp?.nft.name}</Box>
                  {/*{pinResp?.Timestamp && <Box>Created: {(new Date(pinResp.Timestamp)).toLocaleString()}</Box>}*/}
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
                as={Link}
                width={{ base: 'full', lg: '48%' }}
                href={`https://gateway.pinata.cloud/ipfs/${pinResp?.nft.image}`}
                target={'_blank'}
                justifyContent={{ base: 'center', lg: 'end' }}
              >
                {pinResp && (
                  <Image
                    src={pinResp?.nft.image}
                    alt={pinResp?.nft.name}
                    minW={200}
                    width={300}
                    height={300}
                    objectFit={'contain'}
                  />
                )}
              </WrapItem>
            </Wrap>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

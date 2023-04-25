import {
  Heading,
  Box,
  Flex,
  Spacer,
  Button,
  Stack,
  Alert,
  VStack,
  useColorMode,
  AlertIcon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  IconButton,
  Text,
  Icon, Link, HStack,
} from '@chakra-ui/react';
import useTranslation from 'next-translate/useTranslation';
import { default as NextLink } from 'next/link';
import { MoonIcon, SunIcon, LockIcon, UnlockIcon, WarningIcon, HamburgerIcon } from '@chakra-ui/icons';
import setLanguage from 'next-translate/setLanguage';
import Head from 'next/head';
import { useAccount, useContractReads, useNetwork } from 'wagmi';
import { NavLink } from '@/components';
import { defaultChain, getContractAddress } from '@/utils/contract';
import { ConnectionProfile } from '@/components/wallet';
import LearnToEarnABI from '@/utils/abis/LearnToEarn.json';
import { AiFillTwitterCircle } from 'react-icons/ai';
import { FaGlobeAsia } from 'react-icons/fa';

interface LayoutProps {
  children: React.ReactNode;
}

interface navItemInterface {
  type: 'navlink' | 'button' | 'dropdown' | 'divider';
  component?: React.ReactNode;
  admin: boolean;
  public: boolean;
}


const MobileNav = (props: { children: React.ReactNode }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t, lang } = useTranslation('common');

  return (
    <>
      <IconButton
        aria-label='Open menu'
        icon={<HamburgerIcon />}
        onClick={onOpen}
        variant='ghost'
        size={'lg'}
      />
      <Drawer isOpen={isOpen} onClose={onClose} placement='left'>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Menu</DrawerHeader>
            <DrawerBody as={VStack} align={'stretch'}>
              {props.children}
            </DrawerBody>
            <DrawerFooter pt={10}>
              {t('COPYRIGHT_LINE')}
            </DrawerFooter>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
};

const Layout = ({ children }: LayoutProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { address, connector, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { t, lang } = useTranslation('common');
  const { colorMode, toggleColorMode } = useColorMode();

  const LearnContract = {
    address: getContractAddress('LearnToEarn'),
    abi: LearnToEarnABI,
    chainId: chain?.id,
  };

  const {
    data: adminAddresses,
    isError: contractReadError,
    isLoading,
  } = useContractReads({
    contracts: Object.entries(
      {
        'owner': [],
        'isAdmin': [address],
      }).map(
      ([k, v], index) => {
        // let args = v.length ? { args: v } : {};
        return {
          ...
            LearnContract,
          functionName: k,
          args: v,
        };
      }),
  });
  const NavItems = (<>
    <NavLink as={NextLink} href='/' mr={16}>
      <Heading size='md'>
        <pre>{t('nav.HEADING')}</pre>
      </Heading>
    </NavLink>
    {isConnected && chain?.id === defaultChain.id && <NavLink href={'/quests'}>
      {t('nav.QUESTS')}
    </NavLink>}
    <NavLink href='/faucet'>
      {t('nav.FAUCET')}
    </NavLink>
    <Spacer />
    <Button
      onClick={onOpen}
      variant={'outline'}
      colorScheme={
        isConnected && chain?.id == defaultChain.id
          ? 'green'
          : isConnected
            ? 'orange'
            : 'red'
      }
      leftIcon={isConnected && chain?.id === defaultChain.id ? <LockIcon /> : isConnected ? <WarningIcon /> :
        <UnlockIcon />}
    >
      {isConnected ? `${t('wallet.CONNECTED')} - ${chain?.name}` : t('wallet.NOT_CONNECTED')}
    </Button>
    {isConnected && chain?.id === defaultChain.id && (adminAddresses?.includes(address) || adminAddresses?.includes(true)) &&
      <NavLink href='/admin'>
        {t('nav.ADMIN')}
      </NavLink>}
    <Button size='md' onClick={toggleColorMode} p={4}>
      {colorMode == 'dark' ? <SunIcon /> : <MoonIcon />}
    </Button>
    <Button size='md' onClick={async () => await setLanguage(lang == 'en' ? 'ja' : 'en')}>
      {lang == 'en' ? '日本' : 'En'}
    </Button>
  </>);

  return (
    <>
      <Head>
        <title>{t('nav.HEADING')}</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <HStack spacing={4} px={8} position={'fixed'} top={0} left={0} right={0}>
        <Box display={{ base: 'block', lg: 'none' }}>
          <HStack spacing={4}>
            <MobileNav>
              {NavItems}
              <hr style={{ marginTop: '3em' }} />
            </MobileNav>
            <Spacer />
            <NavLink as={NextLink} href='/' mr={16}>
              <Heading size='md'>
                <pre>{t('nav.HEADING')}</pre>
              </Heading>
            </NavLink>
            <Spacer/>
          </HStack>
        </Box>
        <Box width={'full'} display={{ base: 'none', lg: 'block' }}>
          <HStack spacing={1}>
            {NavItems}
          </HStack>
        </Box>
      </HStack>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} size={'xl'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {t('wallet.SETTINGS')}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <ConnectionProfile />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box overflowY={'auto'} position={'fixed'} top={'60px'} left={0} right={0} bottom={0}>
        {!isConnected && <Alert status={'error'}>
          <AlertIcon />
          {t('wallet.CONNECT_TO_CONTINUE')}
        </Alert>}
        {isConnected && chain?.id !== defaultChain.id && <Alert status={'warning'}>
          <AlertIcon />
          {t('wallet.CONNECTED_TO_DIFFERENT_CHAIN')}
        </Alert>}
        {children}
      </Box>
    </>
  );
};

export default Layout;

import {
  Heading,
  Box,
  Link,
  Flex,
  Spacer,
  useColorMode,
  Button,
  Stack,
  Alert,
  AlertIcon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { default as NextLink } from 'next/link';
import { MoonIcon, SunIcon, HamburgerIcon, LockIcon, UnlockIcon, WarningIcon } from '@chakra-ui/icons';
import setLanguage from 'next-translate/setLanguage';
import Footer from '@/components/Footer';
import Head from 'next/head';
import { useAccount, useNetwork } from 'wagmi';
import { NavLink } from '@/components';
import { defaultChain } from '@/utils/contract';
import { Profile } from '@/components/wallet';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { address, connector, isConnected } = useAccount();
  const { chain } = useNetwork();
  const router = useRouter();
  const { t, lang } = useTranslation('common');
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <Head>
        <title>{t('nav.HEADING')}</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Flex px={8}>
        <NavLink as={NextLink} href='/' mr={16}>
          <Heading size='md'>
            <pre>{t('nav.HEADING')}</pre>
          </Heading>
        </NavLink>
        {isConnected && chain?.id === defaultChain.id && <>
          <NavLink href={'/quests'}>
            {t('nav.QUESTS')}
          </NavLink>
          <NavLink href='/faucet'>
            {t('nav.FAUCET')}
          </NavLink>
        </>}
        <Spacer />
        <Stack alignItems={'center'} direction='row' spacing={4}>
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
            leftIcon={isConnected &&chain?.id===defaultChain.id ?<LockIcon/>: isConnected? <WarningIcon/>: <UnlockIcon />}
          >
            {isConnected ? `${t('wallet.CONNECTED')} - ${chain?.name}` : t('wallet.NOT_CONNECTED')}
          </Button>
          {isConnected && chain?.id === defaultChain.id && <NavLink href='/admin'>
            {t('nav.ADMIN')}
          </NavLink>}
          <Button size='md' onClick={toggleColorMode} p={4}>
            {colorMode == 'dark' ? <SunIcon /> : <MoonIcon />}
          </Button>
          <Button size='md' onClick={async () => await setLanguage(lang == 'en' ? 'ja' : 'en')}>
            {lang == 'en' ? '日本' : 'En'}
          </Button>
        </Stack>
      </Flex>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} size={'xl'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('nav.WALLET__SETTINGS')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Profile />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box p={5} minH={'80vh'}>
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
      <Footer />
    </>
  );
};

export default Layout;

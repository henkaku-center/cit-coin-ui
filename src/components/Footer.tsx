import {
  Box,
  Button,
  chakra,
  Container,
  Flex,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
  Icon, Link,
} from '@chakra-ui/react';
import { FaGithubAlt, FaGlobeAsia, FaMap } from 'react-icons/fa';
import { AiFillTwitterCircle } from 'react-icons/ai';
import useTranslation from 'next-translate/useTranslation';
import { default as NextLink } from 'next/link';

const SocialButton = (
  {
    children,
    label,
    href,
  }: {
    children: React.ReactNode
    label: string
    href: string
  }) => {
  return (
    <Button
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      rounded={'full'}
      // w={8}
      // h={8}
      cursor={'pointer'}
      as={'a'}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </Button>
  );
};

const Footer = () => {
  const { t, lang } = useTranslation('common');

  return (
    <Box
      p={5}
      bottom={0}
      position='relative'
      color={useColorModeValue('gray.700', 'gray.200')}
    >
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        {/*<Text>{t('COPYRIGHT_LINE')}</Text>*/}
        <Text>{t('COPYRIGHT_LINE')}</Text>
        <Stack direction={'row'} spacing={6}>
          <SocialButton
            label={'Twitter'}
            href={'https://twitter.com/sakazukixyz'}
          >
            <Text mr={2}>sakazuki</Text>
            <Icon as={AiFillTwitterCircle} />
          </SocialButton>
          <SocialButton
            label={'website'}
            href={'https://sakazuki.xyz'}
          >
            <Text mr={2}>sakazuki.xyz</Text>
            <Icon as={FaGlobeAsia} />
          </SocialButton>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
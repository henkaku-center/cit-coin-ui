import { Box, Container, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import useTranslation from 'next-translate/useTranslation';

const Footer = () => {
  const { t } = useTranslation('common');

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
        justify={{ base: 'center', md: 'center' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Text>{t('COPYRIGHT_LINE')}</Text>
      </Container>
    </Box>
  );
};

export default Footer;

import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Code, Link } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

export const CryptoLink = (
  props: {
    type: 'address' | 'tx';
    value: `0x${string}`;
    colorScheme?: string;
  } & PropsWithChildren,
) => {
  const { type, value, children, colorScheme: color = 'blue.500' } = props;
  return (
    <Code
      as={Link}
      px={3}
      py={1}
      variant={'outline'}
      colorScheme={color}
      borderRadius={'lg'}
      target="_blank"
      href={`https://${
        process.env.NODE_ENV ?? 'dev' === 'dev' ? 'sepolia-optimistic' : 'optimistic'
      }.etherscan.io/address/${value}`}
    >
      {children}
      <ExternalLinkIcon mx={2} />
    </Code>
  );
};

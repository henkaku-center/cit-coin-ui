import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Code, Link } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

const contractUrl = ({
  type,
  value
}: {
  type: 'address' | 'tx';
  value: `0x${string}`;
}) => {
  const network = process.env.NEXT_PUBLIC_NODE_ENV === 'production' ? 'optimistic' : 'sepolia-optimistic';
  return `https://${network}.etherscan.io/${type}/${value}`
}

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
      href={contractUrl({ type, value })}
    >
      {children}
      <ExternalLinkIcon mx={2} />
    </Code>
  );
};

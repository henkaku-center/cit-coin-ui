import { Link, LinkProps } from '@chakra-ui/react';
import NextLink from 'next/link';
import {useRouter} from "next/router";

export const NavLink = (props: LinkProps) => {
  const router = useRouter();
  return (
    <Link
      {...props}
      as={NextLink}
      p={4}
      _hover={{textDecoration: 'none', opacity: '80%', fontWeight: 'medium'}}
      fontWeight={router.pathname==props.href?'bold': 'medium'}
      opacity={router.pathname==props.href?'100%':'60%'}
      minW={'100px'}
    >
      {props.children}
    </Link>
  );
};
import { Box } from "@chakra-ui/react";
// import useTranslation from 'next-translate/useTranslation'
import { Profile } from '@/components/wallet'

const Wallet = () => {
  // const { t } = useTranslation('common')
  return (
    <Box py={20}>
      <Profile />
    </Box>
  )
}

export default Wallet
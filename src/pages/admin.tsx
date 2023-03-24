import {
  Alert, AlertDescription, AlertIcon, AlertTitle, Box,
  Button,
  Container,
  Grid,
  GridItem, Heading,
  Progress,
  Spacer, Spinner,
  Stack,
  Tab,
  TabList, TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import useTranslation from 'next-translate/useTranslation';
import { useAccount, useNetwork } from 'wagmi';
import { QuestionManager } from '@/components/admin';
import { defaultChain } from '@/utils/contract';

const Admin = () => {
  const { t } = useTranslation('common');
  const { address, connector, isConnected } = useAccount();
  const { chain } = useNetwork();

  const adminComponents = [
    {
      title: t('SETQUESTIONS'),
      component: <QuestionManager />,
    },
    {
      title: t('Manage Students'),
      component: <Heading>Manage Students</Heading>,
    },
    {
      title: t('Statistics'),
      component: <Heading>Statistics</Heading>,
    },
    {
      title: t('Settings'),
      component: <Heading>Settings</Heading>,
    },
  ];


  return (
    <>
      {isConnected && chain?.id===defaultChain.id && <Tabs orientation={'vertical'} variant={'soft-rounded'} colorScheme={'blue'}>
        <TabList width={300} minWidth={300}>
          {adminComponents.map(({ title }, idx) => <Tab key={idx}>{title}</Tab>)}
        </TabList>
        <TabPanels>
          {adminComponents.map(({ component }, idx) => <TabPanel key={idx}>{component}</TabPanel>)}
        </TabPanels>
      </Tabs>}
    </>

  );
};
export default Admin;
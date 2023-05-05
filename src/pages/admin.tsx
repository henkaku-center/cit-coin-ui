import {
  Alert, Flex,
  Heading, Icon, Spinner,
  Tab,
  TabList, TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import useTranslation from 'next-translate/useTranslation';
import { useAccount, useContractReads, useNetwork } from 'wagmi';
import { QuestionManager, Settings } from '@/components/admin';
import { defaultChain, getContractAddress } from '@/utils/contract';
import { FaFile, FaUsers, FaChartBar } from 'react-icons/fa';
import { SettingsIcon } from '@chakra-ui/icons';
import LearnToEarnABI from '@/utils/abis/LearnToEarn.json';
import { StudentManager } from '@/components/admin/StudentManager';

const Admin = () => {
  const { t } = useTranslation('admin');
  const { address, connector, isConnected } = useAccount();
  const { chain } = useNetwork();

  const LearnToEarnAddress = getContractAddress('LearnToEarn');

  const LearnContract = {
    address: LearnToEarnAddress,
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
  const hasPermissions = adminAddresses?.includes(address) || adminAddresses?.includes(true);
  // console.log('adminAddresses: ', adminAddresses);

  const adminComponents = [
    {
      title: t('tab.SET_QUESTIONS'),
      icon: FaFile,
      component: <QuestionManager />,
    },
    {
      title: t('tab.MANAGE_STUDENTS'),
      icon: FaUsers,
      component: <StudentManager />,
    },
    {
      title: t('tab.STATISTICS'),
      icon: FaChartBar,
      component: <Heading>Statistics</Heading>,
    },
    {
      title: t('tab.FAUCET'),
      icon: SettingsIcon,
      component: <Settings />,
    },
    {
      title: t('tab.SETTINGS'),
      icon: SettingsIcon,
      component: <Settings />,
    },
  ];


  return (
    <>
      {isLoading && <Flex alignItems={'center'} justifyContent={'center'}>
        <Spinner />
      </Flex>}
      {!hasPermissions && (<Alert variant={'subtle'} status={'error'}>
        {t('NO_PERMISSION')}
      </Alert>)}
      {isConnected && chain?.id === defaultChain.id && hasPermissions &&
        <Tabs
          isLazy={true} orientation={'vertical'} variant={'unstyled'} colorScheme={'blue'} height={'100%'}
        >
          <TabList width={250} minWidth={250} bg={'#abf2'}>
            {adminComponents.map(({ title, icon }, idx) => (
              <Tab fontSize={'md'} key={idx} justifyContent={'flex-start'}
                   _selected={{ color: 'blue.500', fontWeight: 'bold' }}>
                <Icon as={icon} mr={3} boxSize={5} />
                {title}
              </Tab>))}
          </TabList>
          <TabPanels overflowY={'auto'}>
            {adminComponents.map(({ component }, idx) => <TabPanel key={idx}>{component}</TabPanel>)}
          </TabPanels>
        </Tabs>}
    </>

  );
};
export default Admin;
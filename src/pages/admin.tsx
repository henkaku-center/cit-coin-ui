import {
  Alert, Box, Flex,
  Heading, Icon, Spinner,
  Tab,
  TabList, TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import useTranslation from 'next-translate/useTranslation';
import { useAccount, useContract, useContractRead, useNetwork } from 'wagmi';
import { QuestionManager } from '@/components/admin';
import { defaultChain, getContractAddress } from '@/utils/contract';
import { FaFile, FaUsers, FaChartBar } from 'react-icons/fa';
import { SettingsIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
import LearnToEarnABI from '@/utils/abis/LearnToEarn.json';

const Admin = () => {
  const { t } = useTranslation('admin');
  const { address, connector, isConnected } = useAccount();
  const { chain } = useNetwork();
  // const [allowed, setAllowed] = useState(false);

  const LearnToEarnAddress = getContractAddress('LearnToEarn');
  const {
    data: contractData,
    error: contractError,
    isLoading, isIdle,
  } = useContractRead({
    address: LearnToEarnAddress,
    abi: LearnToEarnABI,
    functionName: 'admin',
    chainId: chain?.id,
  });

  // useEffect(() => {
  //   console.log('Contract Data: ', contractData);
  //   console.log('ContractAddress: ', LearnToEarnAddress);
  //   console.log('Environment Variables: ', Object.keys(process.env));
  // }, );

  const adminComponents = [
    {
      title: t('tab.SET_QUESTIONS'),
      icon: FaFile,
      component: <QuestionManager />,
    },
    {
      title: t('tab.MANAGE_STUDENTS'),
      icon: FaUsers,
      component: <Heading>Manage Students</Heading>,
    },
    {
      title: t('tab.STATISTICS'),
      icon: FaChartBar,
      component: <Heading>Statistics</Heading>,
    },
    {
      title: t('tab.SETTINGS'),
      icon: SettingsIcon,
      component: <Heading>Settings</Heading>,
    },
  ];


  return (
    <>
      {isLoading && <Flex alignItems={'center'} justifyContent={'center'}>
        <Spinner />
      </Flex>}
      {address !==contractData && (<Alert variant={'subtle'} status={'error'}>
        {t('NO_PERMISSION')}
      </Alert>)}
      {/*data: {contractData}*/}
      {/*error: {contractError}*/}
      {/*loading: {isLoading}*/}
      {/*idle: {isIdle}*/}
      {isConnected && chain?.id === defaultChain.id && address===contractData &&
        <Tabs orientation={'vertical'} variant={'unstyled'} colorScheme={'blue'}>
          <TabList width={300} minWidth={300}>
            {adminComponents.map(({ title, icon }, idx) => (
              <Tab fontSize={'md'} key={idx} justifyContent={'flex-start'}
                   _selected={{ color: 'blue.500', fontWeight: 'bold' }}>
                <Icon as={icon} mr={3} boxSize={5} />
                {title}
              </Tab>))}
          </TabList>
          <TabPanels>
            {adminComponents.map(({ component }, idx) => <TabPanel key={idx}>{component}</TabPanel>)}
          </TabPanels>
        </Tabs>}
    </>

  );
};
export default Admin;
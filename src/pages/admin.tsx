import {
  Heading, Icon,
  Tab,
  TabList, TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import useTranslation from 'next-translate/useTranslation';
import { useAccount, useNetwork } from 'wagmi';
import { QuestionManager } from '@/components/admin';
import { defaultChain } from '@/utils/contract';
import { FaFile, FaUsers, FaChartBar } from 'react-icons/fa';
import { SettingsIcon } from '@chakra-ui/icons';

const Admin = () => {
  const { t } = useTranslation('admin');
  const { address, connector, isConnected } = useAccount();
  const { chain } = useNetwork();

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
      {isConnected && chain?.id === defaultChain.id &&
        <Tabs orientation={'vertical'} variant={'unstyled'} colorScheme={'blue'}>
          <TabList width={300} minWidth={300}>
            {adminComponents.map(({ title, icon }, idx) => (
              <Tab fontSize={'md'} key={idx} justifyContent={'flex-start'} _selected={{color: 'blue.500', fontWeight: 'bold'}}>
                <Icon as={icon} mr={3} boxSize={5}/>
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
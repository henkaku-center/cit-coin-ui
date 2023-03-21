import {
  Alert, AlertIcon, Box,
  Button,
  Container,
  Grid,
  GridItem, Heading,
  Progress,
  Spacer,
  Stack,
  Tab,
  TabList, TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';
import { MultipleChoiceMultipleSelect, MultipleChoiceSingleSelect } from '@/components/RadioCard';
import React, { useEffect, useState } from 'react';
import { QuestInterface } from '@/types';
import useTranslation from 'next-translate/useTranslation';
import axios from 'axios';
import { AnswerSheet } from '@/components/Answersheet';
import { useAccount } from 'wagmi';


const Admin = () => {
  const [questions, setQuestions] = useState<QuestInterface[]>([]);
  const { t, lang } = useTranslation('common');
  const [sheetsLoading, setSheetsLoading] = useState(false);
  const [sheetsError, setSheetsError] = useState(false);
  const { address, connector, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected) {
      setSheetsLoading(true);
      setSheetsError(false);
      axios.get('/api/quest/').then(response => {
        setQuestions(response.data.questions);
        setSheetsError(false);
      }).catch(err => {
        setSheetsError(true);
      }).finally(() => {
        setSheetsLoading(false);
      });
    }

  }, [isConnected]);

  const adminComponents = [
    {
      title: t('SETQUESTIONS'),
      component: <AnswerSheet quests={questions} />,
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
      {isConnected && <Tabs orientation={'vertical'} variant={'soft-rounded'} colorScheme={'blue'}>
        <TabList width={300}>
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
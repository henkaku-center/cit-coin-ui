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


const Admin = () => {
  const [questions, setQuestions] = useState<QuestInterface[]>([]);
  const { t, lang } = useTranslation('common');

  useEffect(() => {
    axios.get('/api/quest/').then(response => {
      setQuestions(response.data.questions);
    });
  }, []);

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
      <Tabs orientation={'vertical'} variant={'soft-rounded'} colorScheme={'blue'}>
        <TabList width={300}>
          {adminComponents.map(({ title }, idx) => <Tab key={idx}>{title}</Tab>)}
        </TabList>
        <TabPanels>
          {adminComponents.map(({ component }, idx) => <TabPanel key={idx}>{component}</TabPanel>)}
        </TabPanels>
      </Tabs>
    </>

  );
};
export default Admin;
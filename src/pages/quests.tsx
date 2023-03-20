import {
  Alert, AlertIcon,
  Box,
  Button,
  Container,
  Grid,
  GridItem, Heading, Input, Progress, Radio, RadioGroup, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Spacer,
  Stack, Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { QuestInterface } from '@/types';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';
import { MultipleChoiceMultipleSelect, MultipleChoiceSingleSelect } from '@/components/RadioCard';
import useTranslation from 'next-translate/useTranslation';
import { AnswerSheet } from '@/components/Answersheet';

const Quests = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [questions, setQuestions] = useState<QuestInterface[]>([]);
  const { t } = useTranslation('common');

  useEffect(() => {
    axios.get('/api/quest/').then(response => {
      setQuestions(response.data.questions);
    });
  }, []);

  const handleTabsChange = (index: number) => {
    setTabIndex(index);
  };

  return (
    <AnswerSheet quests={questions} />
  );
};
export default Quests;
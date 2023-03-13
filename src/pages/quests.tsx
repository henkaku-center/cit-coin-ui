import {
  Alert,
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

const Quests = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [questions, setQuestions] = useState<QuestInterface[]>([]);
  const { t, lang } = useTranslation('common');

  useEffect(() => {
    axios.get('/api/quest/').then(response => {
      setQuestions(response.data.questions);
    });
  }, []);

  const handleTabsChange = (index: number) => {
    setTabIndex(index);
  };

  return (
    <>
      <Box>
        <Progress hasStripe={true} colorScheme='cyan' min={0} max={2} size='sm' value={tabIndex} mb={5} />
        <Stack direction={'row'} mb={5}>
          <Spacer />
          <Button
            leftIcon={<ArrowLeftIcon />}
            width={'10em'}
            colorScheme={'cyan'}
            isDisabled={tabIndex == 0}
            onClick={() => {
              setTabIndex(tabIndex - 1);
            }}>{t('PREVIOUS')}</Button>
          <Button
            rightIcon={<ArrowRightIcon />}
            width={'10em'}
            colorScheme={'cyan'}
            isDisabled={tabIndex === questions.length - 1}
            onClick={() => {
              setTabIndex(tabIndex + 1);
            }}>{t('NEXT')}</Button>
          <Button colorScheme={'red'}>{t('SUBMIT')}</Button>
        </Stack>
        <Tabs orientation={'vertical'} index={tabIndex} onChange={handleTabsChange}>
          <TabList width={300}>
            {questions.map((_, idx) => (
              <Tab key={`q_tab_${idx}`}>{t('QUESTION')} {idx + 1}</Tab>
            ))}
          </TabList>
          <TabPanels>
            {questions.map(({ question, selection, options }, questionIndex) => (
              <TabPanel key={`t_panel_${questionIndex}`}>
                <Heading>{question}</Heading>
                <Alert variant={'left-accent'}>
                  {selection==='single'?t('SINGLE_SELECT'):t('MULTI_SELECT')}
                </Alert>
                <Box p={5}>
                  {/*<MultipleChoiceMultipleSelect options={options} selection={selection}/>*/}
                  {selection==='single'&&<MultipleChoiceSingleSelect options={options}/>}
                  {selection==='multiple'&&<MultipleChoiceMultipleSelect options={options}/>}
                </Box>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Box>
    </>

  );
};
export default Quests;
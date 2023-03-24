import {
  Alert, AlertIcon, Box,
  Button, Heading, Progress, Spacer, Stack, Tab, TabList, TabPanel, TabPanels, Tabs,
} from '@chakra-ui/react';
import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon, QuestionIcon } from '@chakra-ui/icons';
import { MultipleChoiceMultipleSelect, MultipleChoiceSingleSelect } from '@/components/RadioCard';
import React, { useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { Quest } from '@/types';

export const AnswerSheet = (props: { quests: Quest[] }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const { t } = useTranslation('common');
  const [ans, setAns] = useState<Quest[]>(props.quests.map((q) => ({ ...q, answer: 0 })));

  const handleTabsChange = (index: number) => {
    setTabIndex(index);
  };

  const onAnswer = (answer: number) => {
    setAns([...ans.slice(0, tabIndex), { ...ans[tabIndex], answer: answer }, ...ans.slice(tabIndex + 1)]);
  };
  return (
    <Box>
      <Progress hasStripe={true} colorScheme='cyan' min={0} max={props.quests.length - 1} size='sm' value={tabIndex}
                mb={5} />
      <Stack direction={'row'} mb={5}>
        <Spacer />
        <Button>Answers: {JSON.stringify(ans.map(a => a.answer))}</Button>
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
          isDisabled={tabIndex === props.quests.length - 1}
          onClick={() => {
            setTabIndex(tabIndex + 1);
          }}>{t('NEXT')}</Button>
        <Button colorScheme={'red'}>{t('SUBMIT')}</Button>
      </Stack>
      <Tabs orientation={'vertical'} index={tabIndex} onChange={handleTabsChange}>
        <TabList width={300}>
          {props.quests.map((_, idx) => (
            <Tab key={`q_tab_${idx}`} justifyContent={'flex-start'}>
              {(ans[idx].answer ?? 0) > 0 ?
                <CheckCircleIcon mx={4} color={(ans[idx].answer ?? 0) > 0 ? 'green.500' : 'transparent'} /> :
                <QuestionIcon mx={4} color={'yellow.500'} />}
              {t('QUESTION')} {idx + 1}
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          {props.quests.map(({ question, selection, options, answer }, questionIndex) => (
            <TabPanel key={`t_panel_${questionIndex}`}>
              <Alert variant={'left-accent'} status={selection == 'single' ? 'info' : 'warning'} mb={5}>
                <AlertIcon />
                {selection === 'single' ? t('SINGLE_SELECT') : t('MULTI_SELECT')}
              </Alert>
              <Heading size={'lg'} mb={3}>{questionIndex + 1}. {question}</Heading>
              <Box p={5}>
                {selection === 'single' &&
                  <MultipleChoiceSingleSelect options={options} answer={answer} onAnswer={onAnswer} />}
                {selection === 'multiple' &&
                  <MultipleChoiceMultipleSelect options={options} answer={answer} onAnswer={onAnswer} />}
              </Box>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Box>
  );
};
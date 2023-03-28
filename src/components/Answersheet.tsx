import {
  Alert, AlertIcon, Box,
  Button, Heading, Progress, Spacer, Stack, Tab, TabList, TabPanel, TabPanels, Tabs,
} from '@chakra-ui/react';
import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon, QuestionIcon } from '@chakra-ui/icons';
import { MultipleChoiceMultipleSelect, MultipleChoiceSingleSelect } from '@/components/RadioCard';
import React, { useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { Quest, QuestWithAnswer } from '@/types';
import { getContractAddress } from '@/utils/contract';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import LearnToEarnABI from '@/utils/abis/LearnToEarn.json';

interface AnswersheetInterface {
  quests: Quest[],
  target: 'admin' | 'student'
}

export const AnswerSheet = (props: AnswersheetInterface) => {
  const [tabIndex, setTabIndex] = useState(0);
  const { t } = useTranslation('common');
  const [ans, setAns] = useState<QuestWithAnswer[]>(props.quests.map((q) => ({ ...q, answer: 0 })));
  const answered = ans.filter(a => a.answer !== 0).length;
  const answer = ans.map(a => a.answer).reduce((a, b) => a * 16 + b, 0);

  const LearnToEarnAddress = getContractAddress('LearnToEarn');

  const { config, error: configError } = usePrepareContractWrite({
    address: LearnToEarnAddress,
    functionName: props.target == 'student' ? 'answerQuest' : 'setQuest',
    args: props.target == 'student' ? [answer] : [ans.length, answer],
    abi: LearnToEarnABI,
    enabled: true,
    // enabled: answered == ans.length,
  });
  const {
    write: ContractWrite,
    isLoading: contractWriteLoading,
    data: contractData,
    error: contractWriteError,
  } = useContractWrite(config);

  const handleTabsChange = (index: number) => {
    setTabIndex(index);
  };

  const onAnswer = (answer: number) => {
    setAns([...ans.slice(0, tabIndex), { ...ans[tabIndex], answer: answer }, ...ans.slice(tabIndex + 1)]);
  };
  return (
    <Box py={5}>
      {configError && <Alert status={'error'}>
        <AlertIcon />
        {configError?.message?.includes('ERROR: ALREADY ANSWERED') ? t('quest.ALREADY_ANSWERED') :
          configError?.message?.includes('INVALID: YOU MUST BE A STUDENT TO CONTINUE') ? t('quest.NO_PERMISSION') :
            t('quest.UNKNOWN_ERROR')}
      </Alert>}
      {!configError && <>
        <Stack direction={'row'} mb={5}>
          <Spacer />
          {/*<Button>Answers: {answer.toString(2).padStart(ans.length * 4, '0')}</Button>*/}
          <Button
            leftIcon={<ArrowLeftIcon />}
            borderLeftRadius={'full'}
            width={'10em'}
            colorScheme={'blue'}
            isDisabled={tabIndex == 0}
            onClick={() => {
              setTabIndex(tabIndex - 1);
            }}>{t('PREVIOUS')}
          </Button>
          <Button width={'8em'} borderRadius={0}>{answered} / {ans.length}</Button>
          <Button
            rightIcon={<ArrowRightIcon />}
            borderRightRadius={'full'}
            width={'10em'}
            colorScheme={'blue'}
            isDisabled={tabIndex === ans.length - 1}
            onClick={() => {
              setTabIndex(tabIndex + 1);
            }}>{t('NEXT')}
          </Button>
          <Spacer />

          <Button
            colorScheme={'red'} width={'10em'}
            onClick={() => {
              ContractWrite?.();
            }}
          >{t('SUBMIT')}</Button>
        </Stack>
        <Progress hasStripe={true} colorScheme='pink' min={0} max={ans.length} size='xs' value={answered} mb={5} />
        <Tabs orientation={'vertical'} index={tabIndex} onChange={handleTabsChange}>
          <TabList width={200} minWidth={200}>
            {ans.map((_, idx) => (
              <Tab key={`q_tab_${idx}`} justifyContent={'flex-start'}>
                {(ans[idx].answer ?? 0) > 0 ?
                  <CheckCircleIcon mx={4} color={'blue.500'} /> :
                  <QuestionIcon mx={4} color={'yellow.500'} />}
                {t('QUESTION')} {idx + 1}
              </Tab>
            ))}
          </TabList>
          <TabPanels>
            {ans.map(({ question, selection, options, answer }, questionIndex) => (
              <TabPanel key={`t_panel_${questionIndex}`}>
                <Alert variant={'subtle'} status={selection == 'single' ? 'info' : 'warning'} mb={5}>
                  <AlertIcon />
                  {selection === 'single' ? t('SINGLE_SELECT') : t('MULTI_SELECT')}
                </Alert>
                <Heading size={'md'} mb={3}>{questionIndex + 1}. {question}</Heading>
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
      </>}
    </Box>
  );
};
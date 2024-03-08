import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Heading,
  HStack,
  Progress,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
} from '@chakra-ui/react';
import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon, QuestionIcon } from '@chakra-ui/icons';
import { MultipleChoiceMultipleSelect, MultipleChoiceSingleSelect } from '@/components/RadioCard';
import React, { useEffect, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { Quest, QuestWithAnswer } from '@/types';
import { getContractAddress } from '@/utils/contract';
import { useWriteContract, useSimulateContract, useWaitForTransactionReceipt } from 'wagmi';
import LearnToEarnABI from '@/utils/abis/LearnToEarn.json';
import { sheetActions } from '@/actions';
import { useRouter } from 'next/router';

interface AnswerSheetInterface {
  quests: Quest[];
  target: 'admin' | 'student';
  sheetId: string;
}

export const AnswerSheet = (props: AnswerSheetInterface) => {
  const [tabIndex, setTabIndex] = useState(0);
  const { t } = useTranslation('common');
  const [ans, setAns] = useState<QuestWithAnswer[]>(props.quests.map((q) => ({ ...q, answer: 0 })));
  const answered = ans.filter((a) => a.answer !== 0).length;
  const answer = ans.map((a) => a.answer).reduce((a, b) => a * 16 + b, 0);
  const toast = useToast();
  const LearnToEarnAddress = getContractAddress('LearnToEarn');
  const router = useRouter();

  const updateSheet = () => {
    sheetActions
      .setActiveSheet(props.sheetId)
      .then((response) => {
        toast({
          title: 'Question Updated',
          description: 'All questions has been synced from google sheets',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
      })
      .catch((err) => {
        toast({
          title: 'Question Update failed',
          description: 'There was an error updating sheets',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
      });
  };

  const config = {
    address: LearnToEarnAddress,
    functionName: props.target == 'student' ? 'answerQuest' : 'setQuest',
    args: props.target == 'student' ? [answer] : [ans.length, answer],
    abi: LearnToEarnABI,
  };

  const { isError, error: configError } = useSimulateContract(config);
  const {
    data: hash,
    writeContract,
    isPending: contractWriteLoading,
    isSuccess,
    status,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const handleTabsChange = (index: number) => {
    setTabIndex(index);
  };

  const onAnswer = (answer: number) => {
    setAns([
      ...ans.slice(0, tabIndex),
      { ...ans[tabIndex], answer: answer },
      ...ans.slice(tabIndex + 1),
    ]);
  };

  useEffect(() => {
    if (isConfirmed) {
      if (props.target == 'admin') {
        updateSheet();
      } else {
        toast({
          status: 'success',
          title: 'Answer successfully submitted',
          position: 'top',
          duration: 5000,
          description: 'Your answer has been successfully submitted',
        });
        router.push('/');
      }
    }
  }, [isConfirmed]);
  return (
    <Box py={5}>
      {isError && (
        <Alert status={'error'} my={5}>
          <AlertIcon />
          {configError?.message.includes('ERROR: ALREADY ANSWERED')
            ? t('quest.ALREADY_ANSWERED')
            : configError?.message?.includes('INVALID: YOU MUST BE A STUDENT TO CONTINUE')
              ? t('quest.NO_PERMISSION')
              : t('quest.UNKNOWN_ERROR')}
        </Alert>
      )}
      {isConfirming && (
        <Alert status={'warning'} mb={5}>
          <AlertIcon />
          Please Wait, your transaction is being confirmed.
        </Alert>
      )}
      <Stack
        direction={'row'}
        mb={5}
        flexWrap={'wrap'}
        align={'center'}
        justifyContent={'flex-end'}
        spacing={5}
      >
        <HStack align={'center'} maxW={480} w={'full'} my={3} spacing={0}>
          <Button
            leftIcon={<ArrowLeftIcon />}
            borderLeftRadius={'full'}
            width={{ base: '35%' }}
            colorScheme={'blue'}
            isDisabled={tabIndex == 0 || isError || isConfirming}
            onClick={() => {
              setTabIndex(tabIndex - 1);
            }}
          >
            {t('PREVIOUS')}
          </Button>
          <Button width={'30%'} borderRadius={0}>
            {answered} / {ans.length}
          </Button>
          <Button
            rightIcon={<ArrowRightIcon />}
            borderRightRadius={'full'}
            width={'35%'}
            colorScheme={'blue'}
            isDisabled={tabIndex === ans.length - 1 || !!isError || isConfirming}
            onClick={() => {
              setTabIndex(tabIndex + 1);
            }}
          >
            {t('NEXT')}
          </Button>
        </HStack>
        {/*<Spacer />*/}
        <Button
          isLoading={isConfirming || contractWriteLoading}
          isDisabled={answered < props.quests.length || !!isError}
          colorScheme={'red'}
          width={'10em'}
          onClick={() => {
            writeContract?.(config);
          }}
        >
          {t('SUBMIT')}
        </Button>
      </Stack>
      <Progress
        hasStripe={true}
        colorScheme="pink"
        min={0}
        max={ans.length}
        size="xs"
        value={answered}
        mb={5}
      />
      {!isError && (
        <Tabs orientation={'vertical'} index={tabIndex} onChange={handleTabsChange}>
          <TabList width={200} minWidth={200} display={{ base: 'none', md: 'block' }}>
            {ans.map((_, idx) => (
              <Tab key={`q_tab_${idx}`} justifyContent={'flex-start'} isDisabled={isConfirming}>
                {(ans[idx].answer ?? 0) > 0 ? (
                  <CheckCircleIcon mx={4} color={'blue.500'} />
                ) : (
                  <QuestionIcon mx={4} color={'yellow.500'} />
                )}
                {t('QUESTION')} {idx + 1}
              </Tab>
            ))}
          </TabList>
          <TabPanels>
            {ans.map(({ question, selection, options, answer }, questionIndex) => (
              <TabPanel key={`t_panel_${questionIndex}`}>
                <Alert
                  variant={'subtle'}
                  status={selection == 'single' ? 'info' : 'warning'}
                  mb={5}
                >
                  <AlertIcon />
                  {selection === 'single' ? t('SINGLE_SELECT') : t('MULTI_SELECT')}
                </Alert>
                <Heading as={Box} size={'md'} mb={3}>
                  <Text mb={4} display={{ base: 'block', md: 'none' }} color={'blue.500'}>
                    {t('QUESTION')}
                    {questionIndex + 1}.
                  </Text>
                  {question.split(/(?:\r\n|\r|\n)/g).map((para, idx) => (
                    <Text key={idx} mb={4}>
                      {para}
                    </Text>
                  ))}
                </Heading>
                <Box p={5}>
                  {selection === 'single' && (
                    <MultipleChoiceSingleSelect
                      options={options}
                      answer={answer}
                      onAnswer={onAnswer}
                    />
                  )}
                  {selection === 'multiple' && (
                    <MultipleChoiceMultipleSelect
                      options={options}
                      answer={answer}
                      onAnswer={onAnswer}
                    />
                  )}
                </Box>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      )}
    </Box>
  );
};

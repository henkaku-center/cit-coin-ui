import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Select, Spacer, Spinner, Stack } from '@chakra-ui/react';
import { AnswerSheet } from '@/components';
import React, { useEffect, useState } from 'react';
import { Quest } from '@/types';
import useTranslation from 'next-translate/useTranslation';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';
import axios from 'axios';
import { getContractAddress } from '@/utils/contract';
import QuestABI from '@/utils/abis/LearnToEarn.json';

export const QuestionManager = () => {
  const [sheets, setSheets] = useState<string[]>([]);
  const [activeSheet, setActiveSheet] = useState('');
  const [questions, setQuestions] = useState<Quest[]>([]);
  const { t } = useTranslation('admin');
  const [sheetsLoading, setSheetsLoading] = useState(false);

  const [sheetsError, setSheetsError] = useState(false);

  useEffect(() => {
    setSheetsLoading(true);
    setSheetsError(false);
    axios.get('/api/sheets/').then(response => {
      setSheets(response.data.sheets);
      setSheetsError(false);
    }).catch(err => {
      setSheetsError(true);
    }).finally(() => {
      setSheetsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (activeSheet == '') {
      setQuestions([]);
    } else {
      setSheetsLoading(true);
      setSheetsError(false);
      axios.get(`/api/quest/?sheet=${activeSheet}`).then(response => {
        setQuestions(response.data.questions);
        setSheetsError(false);
      }).catch(err => {
        setSheetsError(true);
      }).finally(() => {
        setSheetsLoading(false);
      });
    }
  }, [activeSheet]);
  return (
    <>
      <Stack mb={5} direction={'row'}>
        {sheets.length > 0 && <Select
          // border={'2px solid'} borderColor={'whiteAlpha.500'}
          // variant={'filled'}
          width={'300px'} borderWidth={2}
          placeholder={t('quest.SELECT_SHEET')}
          isDisabled={sheetsLoading}
          onChange={(event) => {
            setActiveSheet(event.target.value);
          }}>
          {sheets.map((sheet, index) => <option key={index} value={sheet}>{sheet}</option>)}
        </Select>}
        <Spacer />
      </Stack>
      {sheetsLoading && <Box display={'flex'} alignItems={'center'} justifyContent={'center'} minH={'50vh'}>
        <Spinner size={'xl'} thickness={'3px'} color={'blue.500'} />
      </Box>}
      {!sheetsLoading && !sheetsError && questions.length > 0 && <AnswerSheet target={'admin'} quests={questions} />}
      {sheetsError && <Alert status={'error'}>
        <AlertIcon />
        <AlertTitle>{t('ERROR_LOADING_CONTENT')}</AlertTitle>
        <AlertDescription>
          {t('ERROR_LOADING_CONTENT_DESCRIPTION')}
        </AlertDescription>
      </Alert>}
    </>
  );
};
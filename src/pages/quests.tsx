import {
  Alert, AlertDescription,
  AlertIcon, AlertTitle,
  Box,
  Spinner,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Quest } from '@/types';
import useTranslation from 'next-translate/useTranslation';
import { AnswerSheet } from '@/components/Answersheet';
import { useAccount, useNetwork } from 'wagmi';
import { defaultChain } from '@/utils/contract';

const Quests = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [questions, setQuestions] = useState<Quest[]>([]);
  const { t } = useTranslation('common');
  const [sheetsLoading, setSheetsLoading] = useState(false);
  const [sheetsError, setSheetsError] = useState(false);
  const { address, connector, isConnected } = useAccount();
  const { chain } = useNetwork();

  useEffect(() => {
    if (isConnected && chain?.id==defaultChain.id) {
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

  }, [isConnected, chain]);

  return (
    <>
      {sheetsLoading && <Box display={'flex'} alignItems={'center'} justifyContent={'center'} minH={'50vh'}>
        <Spinner size={'xl'} thickness={'3px'} color={'blue.500'} />
      </Box>}
      {!(sheetsLoading || sheetsError) && isConnected &&chain?.id==defaultChain.id && <AnswerSheet quests={questions} />}
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
export default Quests;
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Select,
  Spacer,
  Spinner,
  Stack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  useToast,
} from '@chakra-ui/react';
import { AnswerSheet } from '@/components';
import React, { useEffect, useState } from 'react';
import { Quest, TQuestStorage } from '@/types';
import useTranslation from 'next-translate/useTranslation';
import axios from 'axios';
import { sheetActions } from '@/actions';
import { FaSync } from 'react-icons/fa';

export const QuestionManager = () => {
  const [sheets, setSheets] = useState<string[]>([]);
  const [activeSheet, setActiveSheet] = useState('');
  const [questions, setQuestions] = useState<Quest[]>([]);
  const { t } = useTranslation('admin');
  const [sheetsLoading, setSheetsLoading] = useState(false);
  const [sheetsError, setSheetsError] = useState(false);
  const [currentSheet, setCurrentSheet] = useState<TQuestStorage | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    setSheetsLoading(true);
    setSheetsError(false);
    axios
      .get('/api/sheets/')
      .then((response) => {
        setSheets(response.data.sheets);
        setSheetsError(false);
      })
      .catch((err) => {
        setSheetsError(true);
      })
      .finally(() => {
        setSheetsLoading(false);
      });

    axios
      .get('/api/quest/')
      .then((response) => {
        setCurrentSheet(response.data);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    if (activeSheet == '') {
      setQuestions([]);
    } else {
      setSheetsLoading(true);
      setSheetsError(false);
      axios
        .get(`/api/quest/?sheet=${activeSheet}`)
        .then((response) => {
          setQuestions(response.data.questions);
          setSheetsError(false);
        })
        .catch((err) => {
          setSheetsError(true);
        })
        .finally(() => {
          setSheetsLoading(false);
        });
    }
  }, [activeSheet]);
  return (
    <>
      <Stack mb={5} direction={'row'}>
        {sheets.length > 0 && (
          <Select
            // border={'2px solid'} borderColor={'whiteAlpha.500'}
            // variant={'filled'}
            width={'300px'}
            borderWidth={2}
            placeholder={t('quest.SELECT_SHEET')}
            isDisabled={sheetsLoading}
            onChange={(event) => {
              setActiveSheet(event.target.value);
            }}
          >
            {sheets.map((sheet, index) => (
              <option key={index} value={sheet}>
                {sheet} {sheet === currentSheet?.sheetId && `( ${t('quest.CURRENT_SHEET')} )`}
              </option>
            ))}
          </Select>
        )}
        {currentSheet?.sheetId === activeSheet && (
          <Button
            colorScheme={'orange'}
            isLoading={sheetsLoading}
            isDisabled={currentSheet?.sheetId !== activeSheet}
            onClick={onOpen}
            leftIcon={<FaSync />}
          >
            {t('quest.UPDATE_CHANGES')}
          </Button>
        )}

        <Spacer />
      </Stack>
      {sheetsLoading && (
        <Box display={'flex'} alignItems={'center'} justifyContent={'center'} minH={'50vh'}>
          <Spinner size={'xl'} thickness={'3px'} color={'blue.500'} />
        </Box>
      )}
      {!sheetsLoading && !sheetsError && questions.length > 0 && (
        <AnswerSheet sheetId={activeSheet} target={'admin'} quests={questions} />
      )}
      {sheetsError && (
        <Alert status={'error'}>
          <AlertIcon />
          <AlertTitle>{t('ERROR_LOADING_CONTENT')}</AlertTitle>
          <AlertDescription>{t('ERROR_LOADING_CONTENT_DESCRIPTION')}</AlertDescription>
        </Alert>
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('quest.modal.TITLE')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{t('quest.modal.BODY')}</ModalBody>
          <ModalFooter>
            <Button
              isLoading={sheetsLoading}
              colorScheme="blue"
              mr={3}
              onClick={(event) => {
                event.preventDefault();
                setSheetsLoading(true);
                sheetActions
                  .setActiveSheet(activeSheet)
                  .then((resp) => {
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
                  })
                  .finally(() => {
                    setSheetsLoading(false);
                    onClose();
                  });
                // onClose();
              }}
            >
              {t('quest.modal.YES')}
            </Button>
            <Button isDisabled={sheetsLoading} colorScheme={'red'} onClick={onClose}>
              {t('quest.modal.NO')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

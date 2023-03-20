import {
  Alert, AlertIcon, Box,
  Button,
  Heading,
  Progress,
  Spacer,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';
import { MultipleChoiceMultipleSelect, MultipleChoiceSingleSelect } from '@/components/RadioCard';
import React, { useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { QuestInterface } from '@/types';

export const AnswerSheet = (props: { quests: QuestInterface[] }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const { t } = useTranslation('common');

  const handleTabsChange = (index: number) => {
    setTabIndex(index);
  };
  return (
    <Box>
      <Progress hasStripe={true} colorScheme='cyan' min={0} max={props.quests.length - 1} size='sm' value={tabIndex}
                mb={5} />
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
          isDisabled={tabIndex === props.quests.length - 1}
          onClick={() => {
            setTabIndex(tabIndex + 1);
          }}>{t('NEXT')}</Button>
        <Button colorScheme={'red'}>{t('SUBMIT')}</Button>
      </Stack>
      <Tabs orientation={'vertical'} index={tabIndex} onChange={handleTabsChange}>
        <TabList width={300}>
          {props.quests.map((_, idx) => (
            <Tab key={`q_tab_${idx}`}>{t('QUESTION')} {idx + 1}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {props.quests.map(({ question, selection, options }, questionIndex) => (
            <TabPanel key={`t_panel_${questionIndex}`}>
              <Heading mb={3}>{question}</Heading>
              <Alert variant={'left-accent'} status={'info'}>
                <AlertIcon />
                {selection === 'single' ? t('SINGLE_SELECT') : t('MULTI_SELECT')}
              </Alert>
              <Box p={5}>
                {selection === 'single' && <MultipleChoiceSingleSelect options={options} />}
                {selection === 'multiple' && <MultipleChoiceMultipleSelect options={options} />}
              </Box>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Box>
  );
};
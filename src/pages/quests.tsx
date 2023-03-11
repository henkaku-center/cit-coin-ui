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

const Quests = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [questions, setQuestions] = useState<QuestInterface[]>([]);


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
            }}>Previous</Button>
          <Button
            rightIcon={<ArrowRightIcon />}
            width={'10em'}
            colorScheme={'cyan'}
            isDisabled={tabIndex === questions.length-1}
            onClick={() => {
              setTabIndex(tabIndex + 1);
            }}>Next</Button>
          <Button colorScheme={'red'}>Submit</Button>
        </Stack>
        <Tabs orientation={'vertical'} index={tabIndex} onChange={handleTabsChange}>
          <TabList width={300}>
            {questions.map((_, idx) => (
              <Tab key={`qtab_${idx}`}>Question {idx + 1}</Tab>
            ))}
          </TabList>
          <TabPanels>
            {questions.map(({ question, selection, options }, questionIndex) => (
              <TabPanel key={`tpanel_q${questionIndex}`}>
                <Heading>{question}</Heading>
                <Box p={5}>
                  <RadioGroup>
                    <Stack gap={5}>
                      {options.map((option, optionIndex) => (
                        <Radio key={`radio_q${questionIndex}_o${optionIndex}`} value={`${2 ** optionIndex}`}>
                           <div>{option}</div>
                        </Radio>
                      ))}
                    </Stack>
                  </RadioGroup>
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
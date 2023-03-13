import {
  Box,
  RadioProps,
  Stack,
  useRadio,
  useRadioGroup,
} from '@chakra-ui/react';
import React, { useState } from 'react';

export const RadioCard = (props: RadioProps) => {
  const { getInputProps, getCheckboxProps } = useRadio(props);
  const input = getInputProps();
  const checkbox = getCheckboxProps();
  return (
    <Box as={'label'} userSelect={'none'}>
      <input {...input}  />
      <Box
        {...checkbox}
        cursor={'pointer'}
        p={5}
        borderWidth={2}
        borderRadius={'lg'}
        _checked={{
          bg: '#027ce511',
          borderColor: 'blue.500',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
      >
        {props.children}
      </Box>
    </Box>
  );
};

interface SelectProps {
  options: string[];
}

export const MultipleChoiceSingleSelect = (props: SelectProps) => {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'mcq_single',
    defaultValue: '0',
    onChange: console.log,
  });
  const group = getRootProps();
  return (
    <Stack {...group}>
      {props.options.map((content, idx) => {
        const radio = getRadioProps({ value: `${2 ** idx}` });
        return (
          <RadioCard key={idx} {...radio}>
            {content}
          </RadioCard>
        );
      })}
    </Stack>
  );
};

export const MultipleChoiceMultipleSelect = (props: SelectProps) => {
  return (
    <Stack>
      {props.options.map((content, idx) => {
        return (
          <RadioCard key={idx} value={`${2 ** idx}`}>
            {content}
          </RadioCard>
        );
      })}
    </Stack>
  );
};
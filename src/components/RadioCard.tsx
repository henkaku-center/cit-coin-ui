import {
  Box, CheckboxProps,
  Stack, Text, useCheckbox, useCheckboxGroup,
  useRadioGroup,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

export const RadioCard = (props: CheckboxProps) => {
  const { state, getCheckboxProps, getInputProps } =
    useCheckbox(props);
  const input = getInputProps();
  return (
    <Box as={'label'} userSelect={'none'}>
      <input {...input} />
      <Box
        {...getCheckboxProps()}
        cursor={'pointer'}
        p={5}
        pl={3}
        borderWidth={2}
        borderRadius={'lg'}
        _checked={{
          bg: '#027ce511',
          borderColor: 'blue.500',
        }}
        // _focus={{
        //   boxShadow: 'outline',
        // }}
      >
        <Box width={'20px'} mr={2} display={'inline-flex'}>
          {state.isChecked && <CheckCircleIcon color={'blue.500'} />}
        </Box>
        {props.children}
      </Box>
    </Box>
  );
};

interface SelectProps {
  options: string[];
}

export const MultipleChoiceSingleSelect = (props: SelectProps) => {
  const {value, getRadioProps} = useRadioGroup({defaultValue: '0'})
  return (
    <Stack>
      <Text>
        Binary Value: { parseInt(value as string).toString(2).padStart(4, '0')}
      </Text>
      {props.options.map((content, idx) => {
        return (
          // @ts-ignore # here radio props is used for checkbox item
          <RadioCard key={idx} {...getRadioProps({ value: `${2 ** idx}` })}>
            {content}
          </RadioCard>
        );
      })}
    </Stack>
  );
};

export const MultipleChoiceMultipleSelect = (props: SelectProps) => {
  const { value, getCheckboxProps } = useCheckboxGroup({ defaultValue: [] });
  return (
    <Stack>
      <Text>
        Binary Value: {
        value.map(v => parseInt(v as string))
          .reduce((x, y) => x + y, 0)
          .toString(2).padStart(4, '0')
      }
      </Text>
      {props.options.map((content, idx) => {
        return (
          <RadioCard key={idx} {...getCheckboxProps({ value: 2 ** idx })}>
            {content}
          </RadioCard>
        );
      })}
    </Stack>
  );
};
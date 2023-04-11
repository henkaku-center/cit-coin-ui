import { Box, CheckboxProps, Stack, useCheckbox, useCheckboxGroup, useRadioGroup } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { useEffect } from 'react';

interface RadioCardProps extends CheckboxProps {
  square?: boolean;
}

export const RadioCard = (props: RadioCardProps) => {
  const { state, getCheckboxProps, getInputProps } =
    useCheckbox(props);
  const input = getInputProps();
  return (
    <Box as={'label'} userSelect={'none'}>
      <input {...input} />
      <Box
        display={'flex'}
        flexDirection={'row'}
        alignItems={'center'}
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
        _hover={{
          borderColor: 'blue.500',
        }}
      >
        <Box
          bg={state.isChecked ? 'blue.500' : '#8887'}
          borderColor={state.isChecked ? 'blue.500' : '#aaa3'}
          borderRadius={props.square ? 'md' : 'full'} mr={3}
          w={'20px'} h={'20px'} minW={'20px'}
          display={'flex'} alignItems={'center'} justifyContent={'center'}>
          {state.isChecked && <CheckIcon boxSize={3} color={'white'} />}
        </Box>
        <Box>
          {props.children}
        </Box>
      </Box>
    </Box>
  );
};

interface SelectProps {
  options: string[];
  answer?: number;

  onAnswer?(answer: number): void;
}

export const MultipleChoiceSingleSelect = (props: SelectProps) => {
  const { value, getRadioProps } = useRadioGroup({ defaultValue: '0' });
  useEffect(() => {
    props.onAnswer?.(parseInt(value as string));
  }, [value]);
  return (
    <Stack>
      {props.options.map((content, idx) => {
        return (
          // @ts-ignore # radio props used for checkbox item
          <RadioCard
            key={idx} {...getRadioProps({
            value: `${2 ** idx}`,
          })}
          >
            {content}
          </RadioCard>
        );
      })}
    </Stack>
  );
};

export const MultipleChoiceMultipleSelect = (props: SelectProps) => {
  const { value, getCheckboxProps } = useCheckboxGroup({ defaultValue: [] });

  useEffect(() => {
    let intValue = value.map(v => parseInt(v as string)).reduce((x, y) => x + y, 0);
    props.onAnswer?.(intValue);
  }, [value]);

  return (
    <Stack>
      {props.options.map((content, idx) => {
        return (
          <RadioCard square={true} key={idx} {...getCheckboxProps({ value: 2 ** idx })}>
            {content}
          </RadioCard>
        );
      })}
    </Stack>
  );
};
import React, { InputHTMLAttributes, useEffect, useRef, useState, useCallback } from 'react';
import { IconBaseProps } from 'react-icons';
import { useField } from '@unform/core';
import { Container, Error } from '../Input/styles';
import { FiAlertCircle } from 'react-icons/fi';
import TooltipError from '../Tooltip';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  containerStyle?: object;
  icon?: React.ComponentType<IconBaseProps>; //diz que a variavel vai receber um componente do react
}

const Input: React.FC<InputProps> = ({ name, containerStyle, icon: Icon, ...rest}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { fieldName, defaultValue, error, registerField } = useField(name);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
    setIsFilled( !! inputRef.current?.value);
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return(
  <Container style={containerStyle} isErrored={!!error} isFilled={isFilled} isFocused={isFocused}>
    {Icon && <Icon size={20}/>}
      <input
      defaultValue={defaultValue}
      ref={inputRef}
      onFocus={() => handleInputFocus()}
      onBlur={() => handleInputBlur()}
      { ... rest}/>

      {error &&
        <Error title={error}>
        <FiAlertCircle color="#C53030"/>
        </Error>}
  </Container>
  );
};

export default Input;

import React from 'react';
import { FiAlertCircle, FiXCircle } from 'react-icons/fi';
import { useTransition } from 'react-spring';
import { ToastMessage, useToast } from '../../hooks/ToastContext';

import Toast from './Toast';

import { Container } from './styles';

interface ToastContainerProps {
  messages: ToastMessage[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ messages }) => {
  const messagesWithTransictions = useTransition(
    messages,
    message => message.id,
    { from:
      { right: '-120%' },
      enter: { right: '0%' },
      leave: { right: '-120%' }
    });

  return <Container>
    {messagesWithTransictions.map(({item, key, props}) => (
      <Toast key={key} message={item} style={props}/>
    ))}
  </Container>;
};

export default ToastContainer;

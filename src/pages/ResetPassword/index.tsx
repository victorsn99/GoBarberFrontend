import React, { useRef, useCallback, useContext, useState } from 'react';

import * as Yup from 'yup';

import { Form } from '@unform/web';

import { Link, useHistory, useLocation } from 'react-router-dom';

import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { useAuth } from '../../hooks/AuthContext';
import { useToast } from '../../hooks/ToastContext';

import { Container, Content, Background, AnimationContainer } from './styles';
import { FormHandles } from '@unform/core';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';

interface ResetPasswordFormData {
  password_confirmation: string,
  password: string,
}

const ResetPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);

  const { user, signIn } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();
  const location = useLocation();

  console.log(user);

  const handleOnSubmit = useCallback(async (data: ResetPasswordFormData) => {
    try {
      setLoading(true);

      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        password: Yup.string().min(6, 'Digite uma senha com no mínimo 6 caracteres'),
        password_confirmation: Yup.string().oneOf(
          [Yup.ref('password'), undefined],
           'As senhas precisam ser iguais.'),
      });  //schema de validação

      await schema.validate(data, {
        abortEarly: false
      });

      const token = location.search.replace('?token=', '');

      if (!token) {
        addToast({
          type: 'error',
          title: 'Error',
          description: 'Invalid JWT Token.',
        });
        history.push('/');
      }

      await api.post('/password/reset', {
        password: data.password,
        password_confirmation: data.password_confirmation,
        token: token,
      });

      addToast({
        type: 'success',
        title: 'Sucesso',
        description: 'Senha recuperada. Você já pode fazer login.'
      });

      history.push('/');
    } catch (err) {
      if (err instanceof Yup.ValidationError ){
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);

        return;
      }
      addToast({
        type: 'error',
        title: 'Erro',
        description: 'Erro na recuperação da senha. Tente novamente.',
      });
    } finally {
      setLoading(false);
    }

  }, [signIn, addToast, useLocation, useHistory]);

  return(
  <Container>
    <Content>
      <AnimationContainer>
        <img src={logoImg} alt="Gobarber"/>

        <Form ref={formRef} onSubmit={handleOnSubmit}>
          <h1>Configurar nova senha</h1>

          <Input name="password" icon={FiLock} type="password" placeholder="Senha"/>
          
          <Input name="password_confirmation" icon={FiLock} type="password" placeholder="Confirmação da senha"/>

          <Button loading={loading} type="submit">Confirmar</Button>

        </Form>
      </AnimationContainer>
    </Content>
    <Background/>

  </Container>
);};

export default ResetPassword;

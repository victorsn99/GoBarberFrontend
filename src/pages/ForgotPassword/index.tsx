import React, { useRef, useCallback, useContext, useState } from 'react';

import * as Yup from 'yup';

import { Form } from '@unform/web';

import { Link, useHistory } from 'react-router-dom';

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

interface ForgotPasswordFormData {
  email: string,
  password: string,
}

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);

  const { user, signIn } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();

  console.log(user);

  const handleOnSubmit = useCallback(async (data: ForgotPasswordFormData) => {
    try {
      setLoading(true);

      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        email: Yup.string().required('Email obrigatório').email('Digite um e-mail válido'),
        password: Yup.string().min(6, 'Digite uma senha com no mínimo 6 caracteres'),
      });  //schema de validação

      await schema.validate(data, {
        abortEarly: false
      });

      await api.post('/password/forgot', {
        email: data.email,
      });

      addToast({
        type: 'success',
        title: 'Sucesso',
        description: 'Verifique o seu email para confirmar a recuperação de senha.'
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
        description: 'Erro na recuperação da senha. Verifique se o e-mail está correto.',
      });
    } finally {
      setLoading(false);
    }

  }, [signIn, addToast]);

  return(
  <Container>
    <Content>
      <AnimationContainer>
        <img src={logoImg} alt="Gobarber"/>

        <Form ref={formRef} onSubmit={handleOnSubmit}>
          <h1>Esqueci minha senha</h1>

          <Input name="email" icon={FiMail} placeholder="E-mail"/>

          <Button loading={loading} type="submit">Recuperar</Button>

        </Form>

        <Link to="/">
          <FiLogIn/>
          Voltar ao login</Link>
      </AnimationContainer>
    </Content>
    <Background/>

  </Container>
);};

export default ForgotPassword;

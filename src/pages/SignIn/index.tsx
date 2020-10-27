import React, { useRef, useCallback, useContext } from 'react';

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

interface SignInFormData {
  email: string,
  password: string,
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { user, signIn } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();

  console.log(user);

  const handleOnSubmit = useCallback(async (data: SignInFormData) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        email: Yup.string().required('Email obrigatório').email('Digite um e-mail válido'),
        password: Yup.string().min(6, 'Digite uma senha com no mínimo 6 caracteres'),
      });  //schema de validação

      await schema.validate(data, {
        abortEarly: false
      });

      await signIn({
        email: data.email,
        password: data.password,
      });

      history.push('/dashboard');
    } catch (err) {
      if (err instanceof Yup.ValidationError ){
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);

        addToast({
          type: 'error',
          title: 'Erro na autenticação',
          description: 'Erro no login. Verifique suas informações.',
        });

        return;
      }
    }

  }, [signIn, addToast]);

  return(
  <Container>
    <Content>
      <AnimationContainer>
        <img src={logoImg} alt="Gobarber"/>

        <Form ref={formRef} onSubmit={handleOnSubmit}>
          <h1>Faça seu logon</h1>

          <Input name="email" icon={FiMail} placeholder="E-mail"/>

          <Input name="password" icon={FiLock} type="password" placeholder="Senha"/>

          <Button type="submit">Entrar</Button>

          <a href="forgot">Esqueci minha senha</a>


        </Form>

        <Link to="/signup">
          <FiLogIn/>
          Criar minha conta</Link>
      </AnimationContainer>
    </Content>
    <Background/>

  </Container>
);};

export default SignIn;

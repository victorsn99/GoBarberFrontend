import React, {useCallback, useRef} from 'react';
import { FormHandles } from '@unform/core';

import { FiLogIn, FiMail, FiUser, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import getValidationErrors from '../../utils/getValidationErrors';

import { Container, Content, Background, AnimationContainer } from './styles';
import { Link, useHistory } from 'react-router-dom';
import api from '../../services/api';

import { useToast } from '../../hooks/ToastContext';

interface SignUpFormData {
  name: string;
  email: string;
  passowrd: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const handleOnSubmit = useCallback(async (data: SignUpFormData) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string().required('Email obrigatório').email('Digite um e-mail válido'),
        password: Yup.string().min(6, 'Digite uma senha com no mínimo  6 caracteres'),
      });  //schema de validação

      await schema.validate(data, {
        abortEarly: false
      });

      await api.post('/users', data);

      history.push('/');

      addToast({
        type: 'success',
        title: 'Cadastrado com sucesso',
        description: 'Já pode efetuar seu logon.',
      });
    } catch (err) {
      if (err instanceof Yup.ValidationError ){
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);

        addToast({
          type: 'error',
          title: 'Erro',
          description: 'Ocorreu um erro no cadastro, verifique se os dados estão corretos e tente novamente',
        });

        return;
      }

    }
  }, [addToast, history]);

  return(
    <Container>
    <Background/>
    <Content>
      <AnimationContainer>
      <img src={logoImg} alt="Gobarber"/>

      <Form ref={formRef} onSubmit={handleOnSubmit}>
        <h1>Faça seu cadastro</h1>

        <Input name="name" icon={FiUser} placeholder="Nome"/>

        <Input name="email" icon={FiMail} placeholder="E-mail"/>

        <Input name="password" icon={FiLock} type="password" placeholder="Senha"/>

        <Button type="submit">Cadastrar</Button>

      </Form>

      <Link to="/">
        <FiLogIn/>
        Voltar para o logon</Link>
        </AnimationContainer>
    </Content>

  </Container>
  )
};

export default SignUp;

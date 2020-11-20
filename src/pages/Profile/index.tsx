import React, {ChangeEvent, FormEvent, useCallback, useRef} from 'react';
import { FormHandles } from '@unform/core';

import { FiLogIn, FiMail, FiUser, FiLock, FiCheck, FiArrowLeft, FiCamera } from 'react-icons/fi';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import getValidationErrors from '../../utils/getValidationErrors';

import { Container, Content, AvatarInput } from './styles';
import { Link, useHistory } from 'react-router-dom';
import api from '../../services/api';

import { useToast } from '../../hooks/ToastContext';
import { useAuth } from '../../hooks/AuthContext';

interface ProfileFormData {
  name: string;
  email: string;
  password: string;
  old_password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const handleOnSubmit = useCallback(async (data: ProfileFormData) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string().required('Email obrigatório').email('Digite um e-mail válido'),
        old_password: Yup.string(),
        password: Yup.string().when('old_password', {
          is: value => !!value.length,
          then: Yup.string().min(6).required('Campo obrigatório'),
          otherwise: Yup.string().min(0),
        }),
        password_confirmation: Yup.string().when('old_password', {
            is: value => !!value.length,
            then: Yup.string().min(6).required('Campo obrigatório'),
            otherwise: Yup.string().min(0).oneOf(
              [Yup.ref('password'), undefined],
               'As senhas precisam ser iguais.'),
          }),
      });  //schema de validação

      await schema.validate(data, {
        abortEarly: false
      });

      const { name, email, password, old_password, password_confirmation} = data;

      const formData = Object.assign({
        name,
        email,
      }, old_password ? {
        old_password,
        password,
        password_confirmation,
      } : {});

      const response = await api.put('/profile/update', formData);

      updateUser(response.data);

      history.push('/dashboard');

      addToast({
        type: 'success',
        title: 'Sucesso',
        description: 'Seu usuário foi atualizado.',
      });
    } catch (err) {
      if (err instanceof Yup.ValidationError ){
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);

        addToast({
          type: 'error',
          title: 'Erro',
          description: 'Ocorreu um erro na atualização do perfil, verifique se os dados estão corretos e tente novamente',
        });

        return;
      }

    }
  }, [addToast, history]);

  const handleAvatarChange = useCallback(async(e: ChangeEvent<HTMLInputElement>) => {
    if(e.target.files) {
      const data = new FormData();

      data.append('avatar', e.target.files[0]);
      
      await api.patch('users/avatar/update', data).then((response) => {
        updateUser(response.data);

        addToast({
          type: 'success',
          title: 'Sucesso',
          description: 'Foto de perfil alterada.',
        });
      });
    }
  }, []);
  return(
    <Container>
      
      <header>
        <div>
          <Link to="/dashboard">
          <FiArrowLeft/>
          </Link>
        </div>
      </header>
    <Content>

      <Form ref={formRef} initialData={{name: user.name, email: user.email}} onSubmit={handleOnSubmit}>
        <AvatarInput>
          <img src={user.avatar_url} alt={user.name}/>
          <label id="change_avatar" htmlFor="avatar">
          <FiCamera></FiCamera>
          <input type="file" id="avatar" onChange={handleAvatarChange}/>
          </label>

        </AvatarInput>

        <h1>Meu perfil</h1>

        <Input name="name" icon={FiUser} placeholder="Nome"/>

        <Input name="email" icon={FiMail} placeholder="E-mail"/>

        <Input containerStyle={{ marginTop: 24 }} name="old_password" icon={FiLock} type="password" placeholder="Senha atual"/>

        <Input name="password" icon={FiLock} type="password" placeholder="Nova senha"/>

        <Input name="password_confirmation" icon={FiCheck} type="password" placeholder="Confirme a nova senha"/>

        <Button type="submit">Confirmar alterações</Button>

      </Form>

    </Content>

  </Container>
  )
};

export default Profile;

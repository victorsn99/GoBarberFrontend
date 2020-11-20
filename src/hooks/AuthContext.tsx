import React, { createContext, useCallback, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../services/api';

interface User {
  id: string;
  avatar_url: string;
  email: string;
  name: string;
}

interface AuthState {
  token: string;
  user: User;
}

interface SignInCredentials {
  email: string,
  password: string;
}

interface AuthContextData {
  user: User;
  signIn(crendentials: SignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: User): void; 
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData); //burrlar tipagem

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@GoBarber:token');
    const user = localStorage.getItem('@GoBarber:user');

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;
      
      return { token, user: JSON.parse(user)};
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async({ email, password }) => {
    const response = await api.post('/session/auth', {
      email,
      password,
    });
    const { token, user } = response.data;

    console.log(token, user);
    

    localStorage.setItem('@GoBarber:token', token);
    localStorage.setItem('@GoBarber:user', JSON.stringify(user));

    setData({ token, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@GoBarber:token');
    localStorage.removeItem('@GoBarber:user');

    setData({} as AuthState);
  }, []);

  const updateUser = useCallback((user: User) => {
    localStorage.setItem('@GoBarber:user', JSON.stringify(user));
    setData({
      token: data.token,
      user,
    });
  }, [setData, data.token]);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, updateUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('UseAuth must be use within an authprovider');
  }

  return context;
}

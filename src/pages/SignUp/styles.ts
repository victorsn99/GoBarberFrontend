import styled, { keyframes } from 'styled-components';
import SignUpBack from '../../assets/sign-up.png';
import { shade } from 'polished';

export const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: stretch;
`;


export const Content = styled.div`
  display: flex;
  place-content: center;
  flex-direction: column;
  width: 100%;
  max-width: 700px;
  align-items: center;


`;

const appearFromRight = keyframes`
  from{
    opacity: 0;
    transform: translateX(50px);
  }
  to{
    opacity: 1;
    transform: translateX(0);
  }
`;

export const AnimationContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;

  animation: ${appearFromRight} 1s;

  form {
    margin: 80px;
    width: 340px;
    text-align: center;

    h1 {
      margin-bottom: 24px;
    }

    button {
      background: #FF9000;
      height: 56px;
      border-radius: 10px;
      border: 0;
      padding: 0 16px;
      color: #312E38;
      width: 100%;
      font-weight: 500;
      margin-top: 16px;
      transition: 0.2s;

      &:hover {
        background:${shade(0.2, '#FF9000')}
      }
    }
  }

  a {
    color: #F4EDE8;
    display: block;
    margin-top: 24px;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: ${shade(0.2, '#F4EDE8')};
    }
  }

  > a {
    color: #FF9000;
    display: block;
    margin-top: 24px;
    text-decoration: none;
    transition: color 0.2s;
    display: flex;
    align-items: center;

    svg {
      margin-right: 16px;
    }

    &:hover {
      color: ${shade(0.2, '#FF9000')};
    }
  }
`;

export const Background = styled.div`
  flex: 1;
  background: url(${SignUpBack}) no-repeat center;
  background-size: cover;
`;

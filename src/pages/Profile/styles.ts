import styled, { keyframes } from 'styled-components';
import SignUpBack from '../../assets/sign-up.png';
import { shade } from 'polished';


export const Container = styled.div`
  > header {
    height: 144px;
    background: #28262E;

    display: flex;
    align-items: center;

    div {
      margin-left: 15%;

      svg {
        color: #999591; 
        width: 25px;
        height: 25px;
      }
    }
  }
`;

export const Content = styled.div`
  display: flex;
  place-content: center;
  flex-direction: column;
  align-items: center;
  margin: -180px auto 0; 

  form {
    margin: 80px;
    width: 340px;
    text-align: center;
    display: flex;
    flex-direction: column;

    h1 {
      margin-bottom: 24px;
      font-size: 20px;
      text-align: left;
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

    input[name= 'old_password'] {
      margin-top: 24px;
    }
  }
`;

export const AvatarInput = styled.div`
  margin-bottom: 32px;
  position: relative;
  align-self: center;

  img {
    width: 186px;
    height: 186px;
    border-radius: 50%;
  }

  label[id='change_avatar'] {
    position: absolute;
    width: 48px;
    height: 48px;
    background: #FF9000;
    border-radius: 50%;
    right: 0;
    bottom: 0;
    border: 0;
    transition: background-color 0.2s;
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;

    input {
      display: none;
    }

    svg {
      height: 20px;
      color: #FFF;
    }

    &:hover {
      background: ${shade(0.2, '#FF9000')};
    }
  }
`;